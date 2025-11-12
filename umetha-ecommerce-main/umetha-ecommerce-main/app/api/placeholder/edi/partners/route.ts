import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Fixed NextAuth import
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; // Fixed prisma import

/**
 * Get all EDI trading partners
 * GET /api/edi/partners
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication - only admins should be able to manage partners
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const partners = await prisma.ediPartner.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(partners);
  } catch (error: any) {
    console.error("Error fetching EDI partners:", error);
    return NextResponse.json(
      { message: "Error fetching EDI partners", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Create a new EDI trading partner
 * POST /api/edi/partners
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication - only admins should be able to manage partners
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Validate required fields
    if (!data.name || !data.partnerId) {
      return NextResponse.json(
        { message: "Name and Partner ID are required" },
        { status: 400 }
      );
    }

    // Check if partner ID already exists
    const existingPartner = await prisma.ediPartner.findUnique({
      where: {
        partnerId: data.partnerId,
      },
    });

    if (existingPartner) {
      return NextResponse.json(
        { message: "Partner ID already exists" },
        { status: 409 }
      );
    }

    // Create the new partner
    const partner = await prisma.ediPartner.create({
      data: {
        name: data.name,
        partnerId: data.partnerId,
        isActive: data.isActive !== undefined ? data.isActive : true,
        supportedDocuments: data.supportedDocuments || [
          "850",
          "855",
          "856",
          "810",
        ],
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      },
    });

    return NextResponse.json({
      success: true,
      message: "EDI partner created successfully",
      partner,
    });
  } catch (error: any) {
    console.error("Error creating EDI partner:", error);
    return NextResponse.json(
      { message: "Error creating EDI partner", error: error.message },
      { status: 500 }
    );
  }
}
