import { NextRequest, NextResponse } from 'next/server';

/**
 * Convert country name to ISO 2-character country code
 */
function getCountryCode(country: string): string {
  if (!country) return 'US';
  
  // If already a 2-character code, return it uppercase
  if (country.length === 2) {
    return country.toUpperCase();
  }
  
  // Common country name to code mappings
  const countryMap: { [key: string]: string } = {
    'united states': 'US',
    'united states of america': 'US',
    'usa': 'US',
    'canada': 'CA',
    'mexico': 'MX',
    'united kingdom': 'GB',
    'uk': 'GB',
    'australia': 'AU',
    'germany': 'DE',
    'france': 'FR',
    'italy': 'IT',
    'spain': 'ES',
    'japan': 'JP',
    'china': 'CN',
    'india': 'IN',
    'brazil': 'BR',
    'russia': 'RU',
    'south korea': 'KR',
    'netherlands': 'NL',
    'belgium': 'BE',
    'switzerland': 'CH',
    'austria': 'AT',
    'sweden': 'SE',
    'norway': 'NO',
    'denmark': 'DK',
    'finland': 'FI',
    'poland': 'PL',
    'portugal': 'PT',
    'greece': 'GR',
    'turkey': 'TR',
    'saudi arabia': 'SA',
    'united arab emirates': 'AE',
    'singapore': 'SG',
    'malaysia': 'MY',
    'thailand': 'TH',
    'indonesia': 'ID',
    'philippines': 'PH',
    'vietnam': 'VN',
    'new zealand': 'NZ',
    'south africa': 'ZA',
    'egypt': 'EG',
    'israel': 'IL',
    'argentina': 'AR',
    'chile': 'CL',
    'colombia': 'CO',
    'peru': 'PE',
  };
  
  const normalizedCountry = country.toLowerCase().trim();
  return countryMap[normalizedCountry] || 'US';
}

/**
 * Get PayPal access token
 */
async function getPayPalAccessToken(): Promise<string> {
  // Get PayPal credentials from environment variables
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';
  const PAYPAL_BASE_URL = PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com' 
    : 'https://api-m.paypal.com';

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
 * Create PayPal order
 */
export async function POST(req: NextRequest) {
  try {
    // Get PayPal credentials from environment variables
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';
    const PAYPAL_BASE_URL = PAYPAL_MODE === 'sandbox' 
      ? 'https://api-m.sandbox.paypal.com' 
      : 'https://api-m.paypal.com';

    // Validate PayPal credentials
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error('PayPal credentials check:', {
        hasClientId: !!PAYPAL_CLIENT_ID,
        hasClientSecret: !!PAYPAL_CLIENT_SECRET,
        clientIdLength: PAYPAL_CLIENT_ID?.length || 0,
        clientSecretLength: PAYPAL_CLIENT_SECRET?.length || 0,
      });
      return NextResponse.json(
        { error: 'PayPal credentials not configured. Please check your .env.local file.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { amount, currency = 'USD', items, shipping_address } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Calculate breakdown
    const subtotal = items?.reduce((sum: number, item: any) => 
      sum + (parseFloat(item.price) * item.quantity), 0) || amount;
    const shipping = parseFloat(shipping_address?.shipping_cost || 0);
    const tax = parseFloat(shipping_address?.tax || 0);
    const total = subtotal + shipping + tax;

    // Build PayPal order payload
    const orderPayload: any = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: subtotal.toFixed(2),
              },
              shipping: {
                currency_code: currency,
                value: shipping.toFixed(2),
              },
              tax_total: {
                currency_code: currency,
                value: tax.toFixed(2),
              },
            },
          },
          items: items?.map((item: any) => ({
            name: item.name || 'Product',
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: currency,
              value: parseFloat(item.price).toFixed(2),
            },
          })) || [],
        },
      ],
      application_context: {
        brand_name: 'UMetha',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/paypal/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      },
    };

    // Add shipping address if provided
    if (shipping_address && shipping_address.address) {
      const fullName = `${shipping_address.firstName || ''} ${shipping_address.lastName || ''}`.trim();
      const addressLine1 = String(shipping_address.address || '').trim();
      const city = String(shipping_address.city || '').trim();
      const state = String(shipping_address.state || '').trim();
      const postalCode = String(shipping_address.postalCode || '').trim();
      const countryCode = getCountryCode(shipping_address.country || 'US');
      
      // Only add shipping if we have at least address line 1 and name
      if (fullName && addressLine1) {
        const shippingAddress: any = {
          address_line_1: addressLine1,
          country_code: countryCode,
        };
        
        // Only add optional fields if they have values (PayPal rejects empty strings)
        if (city) shippingAddress.admin_area_2 = city;
        if (state) shippingAddress.admin_area_1 = state;
        if (postalCode) shippingAddress.postal_code = postalCode;
        
        orderPayload.purchase_units[0].shipping = {
          name: {
            full_name: fullName || 'Customer',
          },
          address: shippingAddress,
        };
      }
    }

    // Create order with PayPal
    const paypalResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!paypalResponse.ok) {
      const error = await paypalResponse.text();
      console.error('PayPal order creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: error },
        { status: paypalResponse.status }
      );
    }

    const orderData = await paypalResponse.json();

    // Return order ID and approval URL
    const approvalUrl = orderData.links?.find((link: any) => link.rel === 'approve')?.href;

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      approvalUrl,
      status: orderData.status,
    });

  } catch (error: any) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order', details: error.message },
      { status: 500 }
    );
  }
}

