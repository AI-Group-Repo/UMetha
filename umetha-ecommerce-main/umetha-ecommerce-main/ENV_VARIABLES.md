# Environment Variables Configuration

This document lists all environment variables needed for the UMetha E-Commerce application.

## Required Environment Variables

### Database & Supabase Configuration

```bash
# Supabase Database URL (PostgreSQL connection string)
DATABASE_URL=postgresql://postgres:[your-password]@db.[your-project-ref].supabase.co:5432/postgres

# Supabase Project Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Supabase Service Role Key (KEEP SECRET - Server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### Authentication

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-domain.vercel.app
```

### AI & Machine Learning APIs

```bash
# Google Gemini API Key (REQUIRED for virtual try-on and furniture visualization)
nanoBananaApiKey=your_google_gemini_api_key_here

# OpenAI API Key (optional - for AI chatbot features)
OPENAI_API_KEY=your_openai_api_key_here

# Remove.bg API Key (optional - for background removal features)
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

## Optional Environment Variables

### Payment Gateways

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_MODE=sandbox
# For production: PAYPAL_MODE=live

# Coinbase Commerce
COINBASE_API_KEY=your_coinbase_api_key_here
COINBASE_WEBHOOK_SECRET=your_coinbase_webhook_secret_here

# Coinbase CDP SDK
CDP_API_KEY_NAME=your_cdp_api_key_name_here
CDP_API_KEY_PRIVATE_KEY=your_cdp_private_key_here
```

### Dropshipping & Integrations

```bash
# CJ Dropshipping API
CJ_API_KEY=your_cj_api_key_here

# ClickBank API
CLICKBANK_API_KEY=your_clickbank_api_key_here
CLICKBANK_CLERK_KEY=your_clickbank_clerk_key_here

# EDI Service Provider Configuration
EDI_PROVIDER_NAME=SPS_COMMERCE
EDI_API_BASE_URL=https://api.spscommerce.com/v1
EDI_API_KEY=your_edi_api_key_here
EDI_API_SECRET=your_edi_api_secret_here
EDI_COMPANY_ID=your_edi_company_id_here
EDI_WEBHOOK_SECRET=your_edi_webhook_secret_here
EDI_SCHEDULER_API_KEY=your_edi_scheduler_api_key_here
```

## How to Get API Keys

- **Supabase**: https://supabase.com/dashboard > Your Project > Settings > API
- **Google Gemini**: https://makersuite.google.com/app/apikey
- **OpenAI**: https://platform.openai.com/api-keys
- **Remove.bg**: https://www.remove.bg/api
- **PayPal**: https://developer.paypal.com/dashboard/
- **CJ Dropshipping**: https://developers.cjdropshipping.com/
- **ClickBank**: https://accounts.clickbank.com/

## Vercel Deployment

To add environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add each variable with its value
4. Select which environments (Production, Preview, Development) should use each variable
5. Click **Save**

## Security Best Practices

1. **NEVER** commit `.env` files with actual values to version control
2. Keep all API keys and secrets secure
3. Use different keys for development and production
4. Rotate keys regularly for security
5. The `SUPABASE_SERVICE_ROLE_KEY` should **NEVER** be exposed to the client
6. Always use environment-specific values in Vercel (Production vs Preview)

## Generate NEXTAUTH_SECRET

To generate a secure `NEXTAUTH_SECRET`, run:

```bash
openssl rand -base64 32
```

Or use an online generator like: https://generate-secret.vercel.app/32

