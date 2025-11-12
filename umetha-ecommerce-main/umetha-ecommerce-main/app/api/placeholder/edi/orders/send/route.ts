import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Fixed NextAuth import
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; // Fixed prisma import
import ediService from "@/lib/edi-service";

/**
 * API endpoint to send a purchase order via EDI (850)
 * POST /api/edi/orders/send
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication - only admins should be able to send EDI documents
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get the order with items and addresses
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Check if order already has an EDI reference
    const ediInfo = await prisma.ediOrderInfo.findUnique({
      where: {
        orderId: order.id,
      },
    });

    if (ediInfo?.poSent) {
      return NextResponse.json(
        {
          message: "Purchase order already sent",
          referenceId: ediInfo.poReferenceNumber,
        },
        { status: 409 }
      );
    }

    // Generate a unique order number if not already set
    if (!order.orderNumber) {
      const orderNumber = `PO-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          orderNumber,
        },
      });
      order.orderNumber = orderNumber;
    }

    // Prepare order data for EDI
    const orderData = {
      id: order.id,
      orderNumber: order.orderNumber,
      supplierId: order.supplierId || "DEFAULT_SUPPLIER", // This should be set properly in the order
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item: any) => ({
        sku: item.product.sku || `SKU-${item.product.id}`,
        upc: item.product.upc,
        quantity: item.quantity,
        price: item.price,
        name: item.product.name,
      })),
      shippingAddress: {
        name: order.user.name || "Customer",
        street: order.address.street,
        city: order.address.city,
        state: order.address.state,
        zipCode: order.address.zipCode,
        country: order.address.country,
      },
      billingAddress: {
        name: order.user.name || "Customer",
        street: order.address.street,
        city: order.address.city,
        state: order.address.state,
        zipCode: order.address.zipCode,
        country: order.address.country,
      },
    };

    // Send the purchase order via EDI
    const result = await ediService.sendPurchaseOrder(orderData);

    if (!result.success) {
      return NextResponse.json(
        { message: "Failed to send purchase order", error: result.error },
        { status: 500 }
      );
    }

    // Update the order with EDI info
    await prisma.ediOrderInfo.upsert({
      where: {
        orderId: order.id,
      },
      update: {
        poSent: true,
        poSentAt: new Date(),
        poReferenceNumber: result.referenceId,
      },
      create: {
        orderId: order.id,
        poSent: true,
        poSentAt: new Date(),
        poReferenceNumber: result.referenceId,
      },
    });

    // Update order status
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "PROCESSING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Purchase order sent successfully",
      referenceId: result.referenceId,
    });
  } catch (error: any) {
    console.error("Error sending purchase order:", error);
    return NextResponse.json(
      { message: "Error sending purchase order", error: error.message },
      { status: 500 }
    );
  }
}
