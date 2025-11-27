import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      total_amount,
      status,
      shipping_address,
      payment_method,
      items,
      country,
    } = body;

    // Validate required fields
    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!total_amount || total_amount <= 0) {
      return NextResponse.json(
        { error: "Valid total amount is required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceRoleClient();

    // Calculate total quantity
    const totalQuantity = items.reduce(
      (sum: number, item: any) => sum + (item.quantity || 0),
      0
    );

    // Generate shipment order ID
    const shipmentOrderId = `SHP-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create the order
    const orderData = {
      user_id,
      order_date: new Date().toISOString(),
      status: status || "pending",
      total_amount: Number(total_amount),
      shipmentOrderId,
      quantity: totalQuantity,
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData as any) // Type assertion to bypass strict type checking
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order", details: orderError?.message || "No order returned" },
        { status: 500 }
      );
    }

    // Type assertion for the order object
    const createdOrder = order as any;

    // Create order items in a separate table (if you have one)
    // Check if order_items table exists
    const { error: itemsCheckError } = await supabase
      .from("order_items")
      .select("*")
      .limit(1);

    if (!itemsCheckError) {
      // order_items table exists, insert items
      const orderItems = items.map((item: any) => ({
        order_id: createdOrder.order_id,
        product_id: item.id || item.product_id,
        product_name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.price * item.quantity),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems as any);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        // Order created but items failed - log it but don't fail the request
      }
    }

    // Save shipping address in a separate table (if you have one)
    const { error: addressCheckError } = await supabase
      .from("shipping_addresses")
      .select("*")
      .limit(1);

    if (!addressCheckError && shipping_address) {
      const addressData = {
        order_id: createdOrder.order_id,
        user_id,
        first_name: shipping_address.firstName,
        last_name: shipping_address.lastName,
        email: shipping_address.email,
        phone: shipping_address.phone || '',
        address_line1: shipping_address.address,
        city: shipping_address.city,
        state: shipping_address.state || '',
        postal_code: shipping_address.postalCode,
        country: country || shipping_address.country,
        created_at: new Date().toISOString(),
      };

      const { error: addressError } = await supabase
        .from("shipping_addresses")
        .insert(addressData as any);

      if (addressError) {
        console.error("Error saving shipping address:", addressError);
      }
    }

    // Save payment information (if you have a payments table)
    const { error: paymentCheckError } = await supabase
      .from("payments")
      .select("*")
      .limit(1);

    if (!paymentCheckError && payment_method) {
      const paymentData = {
        order_id: createdOrder.order_id,
        user_id,
        payment_method,
        amount: Number(total_amount),
        status: "completed",
        transaction_date: new Date().toISOString(),
      };

      const { error: paymentError } = await supabase
        .from("payments")
        .insert(paymentData as any);

      if (paymentError) {
        console.error("Error saving payment info:", paymentError);
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        order_id: createdOrder.order_id,
        shipmentOrderId: createdOrder.shipmentOrderId,
        total_amount: createdOrder.total_amount,
        status: createdOrder.status,
        order_date: createdOrder.order_date,
      },
      message: "Order created successfully",
    });
  } catch (error: any) {
    console.error("Error in order creation:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

