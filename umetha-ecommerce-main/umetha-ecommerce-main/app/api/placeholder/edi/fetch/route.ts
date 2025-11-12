import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Fixed NextAuth import
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ediService from "@/lib/edi-service";

/**
 * API endpoint to manually fetch and process EDI documents
 * POST /api/edi/fetch
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication - only admins should be able to fetch EDI documents
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { documentType } = await req.json();

    if (!documentType) {
      return NextResponse.json(
        { message: "Document type is required" },
        { status: 400 }
      );
    }

    let result;

    // Process different document types
    switch (documentType) {
      case "846": // Inventory Updates
        result = await ediService.checkInventoryUpdates();
        break;
      case "855": // Order Confirmations
        result = await ediService.getOrderConfirmations();
        break;
      case "856": // Shipping Notices
        result = await ediService.getShippingNotices();
        break;
      case "810": // Invoices
        result = await ediService.getInvoices();
        break;
      case "all": // Get all document types
        const inventory = await ediService.checkInventoryUpdates();
        const confirmations = await ediService.getOrderConfirmations();
        const shipping = await ediService.getShippingNotices();
        const invoices = await ediService.getInvoices();

        result = {
          success:
            inventory.success &&
            confirmations.success &&
            shipping.success &&
            invoices.success,
          inventory,
          confirmations,
          shipping,
          invoices,
        };
        break;
      default:
        return NextResponse.json(
          { message: `Unsupported document type: ${documentType}` },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { message: "Error fetching EDI documents", error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "EDI documents processed successfully",
      result,
    });
  } catch (error: any) {
    console.error("Error fetching EDI documents:", error);
    return NextResponse.json(
      { message: "Error fetching EDI documents", error: error.message },
      { status: 500 }
    );
  }
}
