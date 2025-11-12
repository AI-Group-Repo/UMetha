# PayPal Payment Gateway Setup Guide

This guide will help you set up and configure PayPal payment gateway for the UMetha e-commerce platform.

## Prerequisites

- PayPal Business Account
- PayPal Developer Account (https://developer.paypal.com/)
- Access to your application's environment variables

## Step 1: Get PayPal Credentials

1. **Create a PayPal Business Account** (if you don't have one)
   - Go to https://www.paypal.com/business
   - Sign up for a business account

2. **Access PayPal Developer Dashboard**
   - Go to https://developer.paypal.com/
   - Sign in with your PayPal business account

3. **Create a New App**
   - Navigate to "My Apps & Credentials" in the dashboard
   - Click "Create App"
   - Fill in the app details:
     - App Name: UMetha E-commerce
     - Merchant: Select your business account
     - Features: Select "Checkout" and "Payments"
   - Click "Create App"

4. **Get Your Credentials**
   - After creating the app, you'll see:
     - **Client ID**: This is your PayPal Client ID
     - **Secret**: This is your PayPal Secret Key
   - **Important**: For production, make sure to switch to "Live" mode and get Live credentials

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root (or update your existing `.env` file) with the following variables:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_secret_key_here
PAYPAL_MODE=sandbox  # Use 'sandbox' for testing, 'live' for production

# Base URL for your application (used in PayPal redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # For development
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com  # For production
```

### Using Your Credentials

Replace the placeholder values with your actual PayPal credentials:

- `PAYPAL_CLIENT_ID`: Your PayPal Client ID (e.g., `AR4DAmnm2kKwAZUJhTI0ATIwezrAQqK_is9rZcmKSl7B5zAQSjG7vgfVTOo21dled_feL25PcFoHORwN`)
- `PAYPAL_CLIENT_SECRET`: Your PayPal Secret Key (e.g., `ENLYBRw3L2G9Y1vdb0_E7s3SLlalNh_rsLG-SkOKVh4t7EVa9bYgiK2-HNfMdu5ubB6LSSt29u0LfWKA`)
- `PAYPAL_MODE`: Set to `sandbox` for testing, `live` for production

## Step 3: Testing in Sandbox Mode

1. **Use Sandbox Test Accounts**
   - In PayPal Developer Dashboard, go to "Sandbox" > "Accounts"
   - Create test buyer and seller accounts
   - Use these accounts to test payments

2. **Test Payment Flow**
   - Add items to cart
   - Proceed to checkout
   - Select PayPal as payment method
   - Complete the payment using a sandbox test account
   - Verify the payment is captured successfully

## Step 4: Production Setup

1. **Switch to Live Mode**
   - In PayPal Developer Dashboard, go to your app
   - Switch from "Sandbox" to "Live" mode
   - Copy your Live Client ID and Secret Key

2. **Update Environment Variables**
   - Update `PAYPAL_CLIENT_ID` with your Live Client ID
   - Update `PAYPAL_CLIENT_SECRET` with your Live Secret Key
   - Set `PAYPAL_MODE=live`
   - Update `NEXT_PUBLIC_BASE_URL` to your production domain

3. **Verify SSL Certificate**
   - Ensure your production site has a valid SSL certificate
   - PayPal requires HTTPS for production transactions

## How It Works

### Payment Flow

1. **User selects PayPal** at checkout
2. **Order is created** on PayPal's servers
3. **User is redirected** to PayPal to authorize payment
4. **User completes payment** on PayPal
5. **User is redirected back** to `/checkout/paypal/success`
6. **Payment is captured** and order is created in your database

### API Endpoints

- `POST /api/checkout/paypal/create-order`: Creates a PayPal order
- `POST /api/checkout/paypal/capture-order`: Captures a PayPal payment
- `GET /api/checkout/paypal/capture-order?orderId=...`: Gets order details

### Files Structure

```
app/
├── api/
│   └── checkout/
│       └── paypal/
│           ├── create-order/
│           │   └── route.ts      # Creates PayPal order
│           └── capture-order/
│               └── route.ts      # Captures PayPal payment
├── checkout/
│   ├── page.tsx                   # Main checkout page
│   └── paypal/
│       └── success/
│           └── page.tsx          # PayPal success callback page
```

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Use HTTPS** in production
4. **Validate payments** on the server side (never trust client-side data)
5. **Implement webhooks** (optional) for payment notifications

## Troubleshooting

### Common Issues

1. **"Failed to create PayPal order"**
   - Check that your credentials are correct
   - Verify `PAYPAL_MODE` matches your credentials (sandbox vs live)
   - Check PayPal API status

2. **"Failed to capture PayPal payment"**
   - Ensure the order was approved by the user
   - Check that the order ID is valid
   - Verify your credentials have proper permissions

3. **Redirect not working**
   - Check `NEXT_PUBLIC_BASE_URL` is set correctly
   - Verify your return URLs in PayPal dashboard match your app

4. **Payment not completing**
   - Check browser console for errors
   - Verify PayPal API responses
   - Check server logs for detailed error messages

## Support

For PayPal-specific issues:
- PayPal Developer Documentation: https://developer.paypal.com/docs/
- PayPal Support: https://www.paypal.com/support

For application-specific issues, check the application logs and error messages.

## Production Checklist

- [ ] PayPal credentials configured in environment variables
- [ ] `PAYPAL_MODE` set to `live`
- [ ] `NEXT_PUBLIC_BASE_URL` set to production domain
- [ ] SSL certificate installed and valid
- [ ] Tested payment flow with real accounts
- [ ] Webhook endpoints configured (if using webhooks)
- [ ] Error handling and logging in place
- [ ] Security best practices implemented

---

**Note**: Always test thoroughly in sandbox mode before switching to production!

