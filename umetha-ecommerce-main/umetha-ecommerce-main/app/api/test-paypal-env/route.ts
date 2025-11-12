import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_MODE = process.env.PAYPAL_MODE;

  return NextResponse.json({
    hasClientId: !!PAYPAL_CLIENT_ID,
    hasClientSecret: !!PAYPAL_CLIENT_SECRET,
    clientIdLength: PAYPAL_CLIENT_ID?.length || 0,
    clientSecretLength: PAYPAL_CLIENT_SECRET?.length || 0,
    clientIdPreview: PAYPAL_CLIENT_ID ? `${PAYPAL_CLIENT_ID.substring(0, 10)}...` : 'NOT FOUND',
    clientSecretPreview: PAYPAL_CLIENT_SECRET ? `${PAYPAL_CLIENT_SECRET.substring(0, 10)}...` : 'NOT FOUND',
    mode: PAYPAL_MODE || 'not set',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('PAYPAL')),
  });
}

