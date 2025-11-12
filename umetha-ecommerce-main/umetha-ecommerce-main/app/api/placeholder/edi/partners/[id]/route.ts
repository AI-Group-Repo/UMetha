import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

/**
 * Get a specific EDI partner by ID
 * GET /api/edi/partners/:id
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication - only admins should be able to manage partners
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const partner = await prisma.ediPartner.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!partner) {
      return NextResponse.json(
        { message: "EDI partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(partner);
  } catch (error: any) {
    console.error("Error fetching EDI partner:", error);
    return NextResponse.json(
      { message: "Error fetching EDI partner", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Update an EDI partner by ID
 * PUT /api/edi/partners/:id
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication - only admins should be able to manage partners
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Check if partner exists
    const existingPartner = await prisma.ediPartner.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingPartner) {
      return NextResponse.json(
        { message: "EDI partner not found" },
        { status: 404 }
      );
    }

    // Check if partnerId is being changed and if it's already in use
    if (data.partnerId && data.partnerId !== existingPartner.partnerId) {
      const partnerIdExists = await prisma.ediPartner.findFirst({
        where: {
          partnerId: data.partnerId,
          NOT: {
            id: params.id,
          },
        },
      });

      if (partnerIdExists) {
        return NextResponse.json(
          { message: "Partner ID is already in use" },
          { status: 409 }
        );
      }
    }

    // Update the partner
    const updatedPartner = await prisma.ediPartner.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        partnerId: data.partnerId !== undefined ? data.partnerId : undefined,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
        supportedDocuments:
          data.supportedDocuments !== undefined
            ? data.supportedDocuments
            : undefined,
        contactEmail:
          data.contactEmail !== undefined ? data.contactEmail : undefined,
        contactPhone:
          data.contactPhone !== undefined ? data.contactPhone : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "EDI partner updated successfully",
      partner: updatedPartner,
    });
  } catch (error: any) {
    console.error("Error updating EDI partner:", error);
    return NextResponse.json(
      { message: "Error updating EDI partner", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Delete an EDI partner by ID
 * DELETE /api/edi/partners/:id
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication - only admins should be able to manage partners
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if partner exists
    const existingPartner = await prisma.ediPartner.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingPartner) {
      return NextResponse.json(
        { message: "EDI partner not found" },
        { status: 404 }
      );
    }

    // Check if partner has any transactions
    const transactionCount = await prisma.ediTransaction.count({
      where: {
        partnerId: existingPartner.partnerId,
      },
    });

    if (transactionCount > 0) {
      // Instead of deleting, mark as inactive
      await prisma.ediPartner.update({
        where: {
          id: params.id,
        },
        data: {
          isActive: false,
        },
      });

      return NextResponse.json({
        success: true,
        message:
          "EDI partner marked as inactive since it has existing transactions",
      });
    }

    // Delete the partner if no transactions exist
    await prisma.ediPartner.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "EDI partner deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting EDI partner:", error);
    return NextResponse.json(
      { message: "Error deleting EDI partner", error: error.message },
      { status: 500 }
    );
  }
}
