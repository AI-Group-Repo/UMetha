import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ediConfig } from "@/lib/edi-config";
import { prisma } from "@/lib/prisma";

/**
 * Middleware to validate webhooks are coming from your EDI provider
 */
function validateSignature(req: NextRequest): boolean {
  try {
    const signature = req.headers.get("x-edi-signature");
    if (!signature) {
      return false;
    }

    // Get the payload
    const payload = JSON.stringify(req.body);

    // Calculate expected signature (implementation varies by provider)
    const expectedSignature = crypto
      .createHmac("sha256", ediConfig.webhookSecret!)
      .update(payload)
      .digest("hex");

    // Check signature
    return signature === expectedSignature;
  } catch (error) {
    console.error("EDI webhook validation error:", error);
    return false;
  }
}

/**
 * EDI webhook endpoint for receiving data from EDI provider
 */
export async function POST(req: NextRequest) {
  // Validate webhook signature
  if (!validateSignature(req)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const documentType = data.documentType; // 846, 855, 856, 810

    let result;

    // Route the webhook to the appropriate handler based on document type
    switch (documentType) {
      case "846": // Inventory Update
        result = await handleInventoryUpdate(data);
        break;
      case "855": // Order Confirmation
        result = await handleOrderConfirmation(data);
        break;
      case "856": // Shipping Notice
        result = await handleShippingNotice(data);
        break;
      case "810": // Invoice
        result = await handleInvoice(data);
        break;
      default:
        console.warn(`Unhandled EDI document type: ${documentType}`);
        return NextResponse.json(
          { message: `Unhandled document type: ${documentType}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error processing EDI webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handle inventory update (EDI 846)
 */
async function handleInventoryUpdate(data: any) {
  try {
    // Log the received inventory update
    await logEdiTransaction({
      documentType: "846",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "received",
      rawData: JSON.stringify(data),
    });

    // Update inventory in database
    for (const item of data.items || []) {
      await prisma.product.updateMany({
        where: {
          sku: item.sku,
        },
        data: {
          countInStock: item.quantityAvailable,
          lastInventoryUpdate: new Date(),
        },
      });
    }

    // Update the transaction status
    await logEdiTransaction({
      documentType: "846",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "processed",
    });

    return {
      success: true,
      message: "Inventory update processed successfully",
    };
  } catch (error: any) {
    console.error(
      `Error processing inventory update ${data.referenceId}:`,
      error
    );

    // Update the transaction status
    await logEdiTransaction({
      documentType: "846",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "error",
      errorMessage: error.message,
    });

    throw error;
  }
}

/**
 * Handle order confirmation (EDI 855)
 */
async function handleOrderConfirmation(data: any) {
  try {
    // Find the order in our database
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: data.poNumber,
      },
    });

    if (!order) {
      throw new Error(
        `Order not found for confirmation ${data.referenceId}, PO: ${data.poNumber}`
      );
    }

    // Log the received order confirmation
    await logEdiTransaction({
      documentType: "855",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "received",
      orderId: order.id,
      rawData: JSON.stringify(data),
    });

    // Update order status based on confirmation
    const orderStatus =
      data.status === "accepted"
        ? "CONFIRMED"
        : data.status === "rejected"
        ? "REJECTED"
        : "PROCESSING";

    // Update the order in the database
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: orderStatus,
      },
    });

    // Create or update EDI order info
    await prisma.ediOrderInfo.upsert({
      where: {
        orderId: order.id,
      },
      update: {
        orderConfirmationReceived: true,
        orderConfirmationReceivedAt: new Date(),
        orderConfirmationReferenceNumber: data.referenceId,
      },
      create: {
        orderId: order.id,
        orderConfirmationReceived: true,
        orderConfirmationReceivedAt: new Date(),
        orderConfirmationReferenceNumber: data.referenceId,
      },
    });

    // Update the transaction status
    await logEdiTransaction({
      documentType: "855",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "processed",
      orderId: order.id,
    });

    return {
      success: true,
      message: "Order confirmation processed successfully",
    };
  } catch (error: any) {
    console.error(
      `Error processing order confirmation ${data.referenceId}:`,
      error
    );

    // Update the transaction status
    await logEdiTransaction({
      documentType: "855",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "error",
      errorMessage: error.message,
    });

    throw error;
  }
}

/**
 * Handle shipping notice (EDI 856)
 */
async function handleShippingNotice(data: any) {
  try {
    // Find the order in our database
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: data.poNumber,
      },
    });

    if (!order) {
      throw new Error(
        `Order not found for shipping notice ${data.referenceId}, PO: ${data.poNumber}`
      );
    }

    // Log the received shipping notice
    await logEdiTransaction({
      documentType: "856",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "received",
      orderId: order.id,
      rawData: JSON.stringify(data),
    });

    // Update the order with shipping details
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "SHIPPED",
        shippedAt: new Date(data.shipDate),
        trackingNumber: data.trackingNumber,
        shippingCarrier: data.carrier,
      },
    });

    // Create or update EDI order info
    await prisma.ediOrderInfo.upsert({
      where: {
        orderId: order.id,
      },
      update: {
        shippingNoticeReceived: true,
        shippingNoticeReceivedAt: new Date(),
        shippingNoticeReferenceNumber: data.referenceId,
      },
      create: {
        orderId: order.id,
        shippingNoticeReceived: true,
        shippingNoticeReceivedAt: new Date(),
        shippingNoticeReferenceNumber: data.referenceId,
      },
    });

    // Update the transaction status
    await logEdiTransaction({
      documentType: "856",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "processed",
      orderId: order.id,
    });

    return { success: true, message: "Shipping notice processed successfully" };
  } catch (error: any) {
    console.error(
      `Error processing shipping notice ${data.referenceId}:`,
      error
    );

    // Update the transaction status
    await logEdiTransaction({
      documentType: "856",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "error",
      errorMessage: error.message,
    });

    throw error;
  }
}

/**
 * Handle invoice (EDI 810)
 */
async function handleInvoice(data: any) {
  try {
    // Find the order in our database
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: data.poNumber,
      },
    });

    if (!order) {
      throw new Error(
        `Order not found for invoice ${data.referenceId}, PO: ${data.poNumber}`
      );
    }

    // Log the received invoice
    await logEdiTransaction({
      documentType: "810",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "received",
      orderId: order.id,
      rawData: JSON.stringify(data),
    });

    // Store the invoice in our database
    await prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        orderId: order.id,
        amount: data.totalAmount,
        currency: data.currency || "USD",
        dueDate: new Date(data.dueDate),
        issuedDate: new Date(data.invoiceDate),
        status: "received",
        ediReferenceNumber: data.referenceId,
      },
    });

    // Update order status to INVOICED
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "INVOICED",
      },
    });

    // Create or update EDI order info
    await prisma.ediOrderInfo.upsert({
      where: {
        orderId: order.id,
      },
      update: {
        invoiceReceived: true,
        invoiceReceivedAt: new Date(),
        invoiceReferenceNumber: data.referenceId,
      },
      create: {
        orderId: order.id,
        invoiceReceived: true,
        invoiceReceivedAt: new Date(),
        invoiceReferenceNumber: data.referenceId,
      },
    });

    // Update the transaction status
    await logEdiTransaction({
      documentType: "810",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "processed",
      orderId: order.id,
    });

    return { success: true, message: "Invoice processed successfully" };
  } catch (error: any) {
    console.error(`Error processing invoice ${data.referenceId}:`, error);

    // Update the transaction status
    await logEdiTransaction({
      documentType: "810",
      direction: "inbound",
      partnerId: data.partnerId,
      referenceId: data.referenceId,
      status: "error",
      errorMessage: error.message,
    });

    throw error;
  }
}

/**
 * Log EDI transaction to the database
 */
async function logEdiTransaction(transactionData: {
  documentType: string;
  direction: "inbound" | "outbound";
  partnerId: string;
  referenceId: string;
  status: string;
  orderId?: string;
  errorMessage?: string;
  rawData?: string;
}) {
  try {
    await prisma.ediTransaction.upsert({
      where: {
        documentType_direction_partnerId_referenceId: {
          documentType: transactionData.documentType,
          direction: transactionData.direction,
          partnerId: transactionData.partnerId,
          referenceId: transactionData.referenceId,
        },
      },
      update: {
        status: transactionData.status,
        orderId: transactionData.orderId,
        errorMessage: transactionData.errorMessage,
        rawData: transactionData.rawData,
        updatedAt: new Date(),
      },
      create: {
        documentType: transactionData.documentType,
        direction: transactionData.direction,
        partnerId: transactionData.partnerId,
        referenceId: transactionData.referenceId,
        status: transactionData.status,
        orderId: transactionData.orderId,
        errorMessage: transactionData.errorMessage,
        rawData: transactionData.rawData,
      },
    });
  } catch (error) {
    console.error("Error logging EDI transaction:", error);
  }
}
