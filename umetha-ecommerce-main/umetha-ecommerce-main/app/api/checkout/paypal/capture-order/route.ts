import { NextRequest, NextResponse } from 'next/server';

/**
 * Get PayPal access token
 */
async function getPayPalAccessToken(): Promise<string> {
  // Get PayPal credentials from environment variables
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';
  const PAYPAL_BASE_URL = PAYPAL_MODE === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com' 
    : 'https://api-m.paypal.com/v1/oauth2/token';

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get PayPal access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Capture PayPal order
 */
export async function POST(req: NextRequest) {
  try {
    // Get PayPal credentials from environment variables
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

    // Validate PayPal credentials
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error('PayPal credentials check:', {
        hasClientId: !!PAYPAL_CLIENT_ID,
        hasClientSecret: !!PAYPAL_CLIENT_SECRET,
      });
      return NextResponse.json(
        { error: 'PayPal credentials not configured. Please check your .env.local file.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';
    const PAYPAL_BASE_URL = PAYPAL_MODE === 'sandbox' 
       ? 'https://api-m.sandbox.paypal.com/v1/oauth2/token' 
      : 'https://api-m.paypal.com/v1/oauth2/token';

    // Capture the order
    const paypalResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation',
      },
    });

    if (!paypalResponse.ok) {
      const error = await paypalResponse.json();
      console.error('PayPal capture error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to capture PayPal order', 
          details: error.message || error,
          paypalError: error 
        },
        { status: paypalResponse.status }
      );
    }

    const captureData = await paypalResponse.json();

    // Check if capture was successful
    if (captureData.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        orderId: captureData.id,
        status: captureData.status,
        payer: captureData.payer,
        purchase_units: captureData.purchase_units,
        paymentSource: captureData.payment_source,
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Payment not completed', 
          status: captureData.status,
          details: captureData 
        },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal order', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Get order details
 */
export async function GET(req: NextRequest) {
  try {
    // Get PayPal credentials from environment variables
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

    // Validate PayPal credentials
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'PayPal credentials not configured. Please check your .env.local file.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';
    const PAYPAL_BASE_URL = PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    // Get order details
    const paypalResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!paypalResponse.ok) {
      const error = await paypalResponse.text();
      return NextResponse.json(
        { error: 'Failed to get order details', details: error },
        { status: paypalResponse.status }
      );
    }

    const orderData = await paypalResponse.json();

    return NextResponse.json({
      success: true,
      order: orderData,
    });

  } catch (error: any) {
    console.error('Error getting PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to get order details', details: error.message },
      { status: 500 }
    );
  }
}

