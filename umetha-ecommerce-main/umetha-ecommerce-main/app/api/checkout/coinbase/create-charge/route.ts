import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { CdpClient } from '@coinbase/cdp-sdk';
import { getAuthHeaders } from '@coinbase/cdp-sdk/auth';

export const runtime = 'nodejs';

let cachedClient: CdpClient | null = null;
let merchantAddressPromise: Promise<string> | null = null;

function isPemPrivateKey(key?: string | null) {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed.includes('BEGIN') && trimmed.includes('PRIVATE KEY');
}

function isLikelyBase64(str?: string | null) {
  if (!str) return false;
  const s = str.trim();
  // Base64 strings typically contain A–Z, a–z, 0–9, +, / and may end with =
  // We allow newlines/spaces which may appear depending on how it was copied.
  const cleaned = s.replace(/\s+/g, '');
  // Do not enforce a strict minimum length; Ed25519 private keys from CDP
  // are commonly ~43–44 chars when Base64-encoded (32 bytes). Some formats
  // may be longer. Let the SDK perform strict validation.
  return /^[A-Za-z0-9+/]+={0,2}$/.test(cleaned);
}

function isValidBase64Ed25519PrivateKey(str?: string | null) {
  if (!str) return false;
  const cleaned = str.trim().replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleaned)) return false;
  try {
    const bytes = Buffer.from(cleaned, 'base64');
    // Accept 32-byte seeds or 64-byte expanded keys
    return bytes.length === 32 || bytes.length === 64;
  } catch {
    return false;
  }
}

function normalizeNewlines(str?: string | null) {
  if (!str) return str ?? undefined;
  // Convert literal "\n" into actual newlines; trim but keep PEM boundaries.
  return str.replace(/\\n/g, '\n').trim();
}

function extractApiKeyId(idRaw?: string | null) {
  if (!idRaw) return undefined;
  const id = idRaw.trim();
  // Accept either bare UUID or a path like "organizations/<orgId>/apiKeys/<keyId>"
  const pathMatch = id.match(/apiKeys\/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/);
  if (pathMatch) return pathMatch[1];
  return id;
}

function isPrivateIp(ip?: string | null) {
  if (!ip) return false;
  const value = ip.trim().toLowerCase();
  // IPv6 private/loopback/link-local ranges
  if (value.includes(':')) {
    return (
      value === '::1' || // loopback
      value.startsWith('fc') || // unique local (fc00::/7)
      value.startsWith('fd') || // unique local (fd00::/8)
      value.startsWith('fe80') // link-local (fe80::/10)
    );
  }
  // IPv4 private ranges
  const parts = value.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
  const [a, b] = parts;
  return (
    a === 10 || // 10.0.0.0/8
    a === 127 || // 127.0.0.0/8 loopback
    (a === 192 && b === 168) || // 192.168.0.0/16
    (a === 169 && b === 254) || // 169.254.0.0/16 link-local
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
    (a === 100 && b >= 64 && b <= 127) || // 100.64.0.0/10 CGNAT
    a === 0 // 0.0.0.0/8
  );
}

function extractPublicClientIp(req: NextRequest) {
  const header =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    undefined;
  const candidate = header?.split(',')[0]?.trim();
  if (candidate && isPrivateIp(candidate)) {
    console.warn('Client IP appears to be private. Omitting clientIp from onramp session payload:', candidate);
    return undefined;
  }
  return candidate || undefined;
}

function getValidWalletSecret() {
  const secret = process.env.CDP_WALLET_SECRET;
  if (!secret) return undefined;
  // Accept PEM EC or base64 Ed25519 formats; otherwise ignore to avoid auth errors
  const normalized = normalizeNewlines(secret);
  if (isPemPrivateKey(normalized) || isLikelyBase64(normalized)) {
    return normalized;
  }
  console.warn('CDP_WALLET_SECRET is present but not in a valid PEM or base64 format. It will be ignored.');
  return undefined;
}

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
        apiKeyId: extractApiKeyId(process.env.CDP_API_KEY_ID),
        apiKeySecret: normalizeNewlines(process.env.CDP_API_KEY_SECRET),
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

    // Prefer a client-provided public IP if available; otherwise use headers.
    const providedIp = typeof body?.clientIp === 'string' ? body.clientIp : undefined;
    const clientIp = (providedIp && !isPrivateIp(providedIp) ? providedIp : undefined) || extractPublicClientIp(req);

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

    // Validate API key secret format to provide actionable error early
    const apiKeySecret = normalizeNewlines(process.env.CDP_API_KEY_SECRET!)!;
    if (!isPemPrivateKey(apiKeySecret) && !isValidBase64Ed25519PrivateKey(apiKeySecret)) {
      return NextResponse.json(
        {
          error:
            'Invalid CDP_API_KEY_SECRET format. Provide either a PEM EC private key (multi-line) or a base64 Ed25519 private key from the CDP portal.',
          hint:
            'In CDP Access → API Keys, create a key with Ed25519 to get a base64 private key (recommended), or ECDSA to get a PEM. Do not use Coinbase Commerce keys.',
        },
        { status: 400 }
      );
    }

    const authHeaders = await getAuthHeaders({
      apiKeyId: extractApiKeyId(process.env.CDP_API_KEY_ID!)!,
      apiKeySecret,
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

      // Provide actionable guidance based on common failure statuses
      let hint = '';
      switch (sessionResponse.status) {
        case 401:
          hint = [
            'Unauthorized: Verify CDP API credentials.',
            'Ensure CDP_API_KEY_ID is the API Key ID from the CDP portal.',
            'Ensure CDP_API_KEY_SECRET is the base64-encoded private key (Ed25519) from the CDP portal.',
            'Do not use Coinbase Commerce keys; this integration uses Coinbase Developer Platform (CDP).',
          ].join(' ');
          break;
        case 403:
          hint = [
            'Forbidden: Check domain allowlist and app permissions in CDP portal.',
            'NEXT_PUBLIC_BASE_URL must match an allowed domain for redirects.',
          ].join(' ');
          break;
        case 422:
          hint = [
            'Unprocessable Entity: Validate request parameters.',
            'Check purchaseCurrency (e.g., USDC), destinationNetwork (e.g., base), and redirectUrl.',
          ].join(' ');
          break;
        case 400:
          // Often returned for missing/invalid client IP in development
          hint = [
            'Bad Request: Ensure a public client IP is provided.',
            'Send clientIp from the frontend (use https://api64.ipify.org?format=json) or configure your proxy to set X-Forwarded-For.',
          ].join(' ');
          break;
        default:
          hint = 'Unexpected error: Review environment variables and request payload.';
      }

      // Add a targeted hint if CDP reports private IP usage
      try {
        const msg = String((errorDetails as any)?.errorMessage || '')
          .toLowerCase();
        if (msg.includes('private ip')) {
          hint = [
            'Client IP is private: omit clientIp or forward the public IP.',
            'When running locally, do not set clientIp; behind proxies ensure X-Forwarded-For contains a public address.',
          ].join(' ');
        }
      } catch {}

      console.error('Coinbase onramp session error:', {
        status: sessionResponse.status,
        statusText: sessionResponse.statusText,
        endpoint: apiUrl,
        details: errorDetails,
        hint,
      });
      return NextResponse.json(
        { error: 'Failed to initialise Coinbase onramp session', details: errorDetails, hint },
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

