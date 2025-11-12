import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { CdpClient } from '@coinbase/cdp-sdk';
import { getAuthHeaders } from '@coinbase/cdp-sdk/auth';

export const runtime = 'nodejs';

let cachedClient: CdpClient | null = null;
let merchantAddressPromise: Promise<string> | null = null;

function ensureCdpEnv() {
  const required = ['CDP_API_KEY_ID', 'CDP_API_KEY_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required Coinbase CDP environment variable(s): ${missing.join(', ')}. ` +
      'Add them to your environment (e.g., .env.local).'
    );
  }
}

function getCdpClient() {
  ensureCdpEnv();
  if (!cachedClient) {
    try {
      cachedClient = new CdpClient({
        apiKeyId: process.env.CDP_API_KEY_ID,
        apiKeySecret: process.env.CDP_API_KEY_SECRET,
        walletSecret: process.env.CDP_WALLET_SECRET,
      });
    } catch (error) {
      cachedClient = null;
      throw error;
    }
  }
  return cachedClient;
}

async function resolveMerchantAddress() {
  if (process.env.CDP_MERCHANT_WALLET_ADDRESS) {
    return process.env.CDP_MERCHANT_WALLET_ADDRESS;
  }

  if (!merchantAddressPromise) {
    const accountName = process.env.CDP_MERCHANT_ACCOUNT_NAME || 'umetha-merchant';

    merchantAddressPromise = getCdpClient().evm
      .getOrCreateAccount({ name: accountName })
      .then((account: { address: string }) => account.address)
      .catch((error: unknown) => {
        merchantAddressPromise = null;
        throw error;
      });
  }

  return merchantAddressPromise;
}

function normalizeCurrencyCode(code?: string) {
  const normalized = String(code || 'USD').trim().toUpperCase().substring(0, 3);
  if (normalized.length !== 3) {
    throw new Error('Invalid currency code. Currency must be a 3-character ISO code (e.g., USD, EUR, GBP).');
  }
  return normalized;
}

function coercePositiveAmount(amount: unknown) {
  const value = typeof amount === 'number' ? amount : parseFloat(String(amount ?? ''));
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Invalid amount. Amount must be a number greater than 0.');
  }
  return value;
}

/**
 * Create a Coinbase CDP Onramp session and return the redirect URL
 */
export async function POST(req: NextRequest) {
  try {
    ensureCdpEnv();

    const body = await req.json();
    const { amount, currency = 'USD', items, shipping_address } = body;

    const currencyCode = normalizeCurrencyCode(currency);
    const totalFromClient = coercePositiveAmount(amount);

    const subtotal = Array.isArray(items)
      ? items.reduce((sum: number, item: any) => {
          const price = parseFloat(item?.price ?? '0');
          const quantity = parseInt(item?.quantity ?? '1', 10);
          return sum + price * (Number.isFinite(quantity) ? quantity : 1);
        }, 0)
      : totalFromClient;

    const shipping = shipping_address?.shipping_cost ? parseFloat(shipping_address.shipping_cost) : 0;
    const tax = shipping_address?.tax ? parseFloat(shipping_address.tax) : 0;
    const total = subtotal + shipping + tax;

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: 'Calculated total is invalid. Please review the order items, shipping, and tax values.' },
        { status: 400 }
      );
    }

    const destinationAddress = await resolveMerchantAddress();

    const purchaseCurrency = process.env.CDP_PURCHASE_CURRENCY || 'USDC';
    const destinationNetwork = process.env.CDP_ONRAMP_NETWORK || 'base';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const referenceId = randomUUID();
    const redirectUrl = (() => {
      try {
        const url = new URL('/checkout/coinbase/success', baseUrl);
        url.searchParams.set('reference', referenceId);
        return url.toString();
      } catch (error) {
        console.warn('Failed to construct redirect URL from base URL, falling back to string concatenation.', error);
        return `${baseUrl.replace(/\/$/, '')}/checkout/coinbase/success?reference=${referenceId}`;
      }
    })();
    const paymentAmount = total.toFixed(2);

    const clientIpHeader =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      undefined;
    const clientIp = clientIpHeader?.split(',')[0]?.trim();

    const apiHost = process.env.CDP_API_HOST || 'api.cdp.coinbase.com';
    const basePath = process.env.CDP_API_BASE_PATH || '/platform';
    const endpointPath = `${basePath.replace(/\/$/, '')}/v2/onramp/sessions`;
    const apiUrl = `https://${apiHost}${endpointPath}`;

    const sessionPayload = {
      destinationAddress,
      destinationNetwork,
      purchaseCurrency,
      paymentAmount,
      paymentCurrency: currencyCode,
      redirectUrl,
      clientIp,
    };

    const authHeaders = await getAuthHeaders({
      apiKeyId: process.env.CDP_API_KEY_ID!,
      apiKeySecret: process.env.CDP_API_KEY_SECRET!,
      walletSecret: process.env.CDP_WALLET_SECRET,
      requestMethod: 'POST',
      requestHost: apiHost,
      requestPath: endpointPath,
      requestBody: sessionPayload,
      source: 'umetha-ecommerce',
    });

    const sessionResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        ...authHeaders,
        Accept: 'application/json',
      },
      body: JSON.stringify(sessionPayload),
    });

    if (!sessionResponse.ok) {
      let errorDetails: unknown;
      try {
        errorDetails = await sessionResponse.json();
      } catch {
        errorDetails = await sessionResponse.text();
      }
      console.error('Coinbase onramp session error:', {
        status: sessionResponse.status,
        statusText: sessionResponse.statusText,
        endpoint: apiUrl,
        details: errorDetails,
      });
      return NextResponse.json(
        { error: 'Failed to initialise Coinbase onramp session', details: errorDetails },
        { status: sessionResponse.status }
      );
    }

    const sessionResult = await sessionResponse.json();
    const onrampUrl = sessionResult.session?.onrampUrl;

    if (!onrampUrl) {
      return NextResponse.json(
        { error: 'Failed to initialise Coinbase onramp session. No redirect URL returned.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      referenceId,
      onrampUrl,
      quote: sessionResult.quote ?? null,
      destinationAddress,
      purchaseCurrency,
      destinationNetwork,
    });
  } catch (error: any) {
    console.error('Error creating Coinbase onramp session:', error);

    const message =
      error?.message ||
      'Failed to create Coinbase session. Please verify your Coinbase credentials and request payload.';

    return NextResponse.json(
      { error: message },
      { status: error?.status || 500 }
    );
  }
}

