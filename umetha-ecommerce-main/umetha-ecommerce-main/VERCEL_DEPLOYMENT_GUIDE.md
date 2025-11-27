# Vercel Deployment Guide for UMetha E-Commerce

## Issues Fixed

This guide outlines the fixes applied to resolve Vercel deployment errors:

### 1. **Removed `fs` Package from Dependencies**
   - **Issue**: The `fs` package was listed as a dependency, which conflicts with Node.js's built-in `fs` module
   - **Fix**: Removed `"fs": "^0.0.1-security"` from `package.json`

### 2. **Fixed Sharp Configuration**
   - **Issue**: Sharp requires native binaries that need special handling in serverless environments
   - **Fix**: Added `serverComponentsExternalPackages: ['sharp']` to `next.config.js`

### 3. **Fixed Polyfills for Browser Compatibility**
   - **Issue**: Using `require()` in polyfills can cause issues in Next.js 15 App Router
   - **Fix**: Converted to dynamic imports with proper browser environment checks

### 4. **Removed Hardcoded API Keys**
   - **Issue**: Hardcoded Google API key in `furniture-tryon/route.ts` (security risk)
   - **Fix**: Removed hardcoded fallback, proper environment variable handling

### 5. **Added Environment Variable Validation**
   - **Issue**: Missing API key validation in `virtual-tryon/route.ts`
   - **Fix**: Added proper validation before API initialization

### 6. **Extended Vercel Function Timeout**
   - **Issue**: AI image generation can take longer than default timeout
   - **Fix**: Added 60-second timeout configuration in `vercel.json`

## Required Environment Variables

Before deploying to Vercel, you must configure these environment variables in your Vercel project settings:

### Required:
- `nanoBananaApiKey` - Google Gemini API key for virtual try-on and furniture visualization
- `DATABASE_URL` - Database connection string (if using Prisma)
- `NEXTAUTH_SECRET` - NextAuth secret for authentication
- `NEXTAUTH_URL` - Your deployed URL (e.g., https://your-app.vercel.app)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Optional:
- `REMOVE_BG_API_KEY` - Remove.bg API key for background removal
- `OPENAI_API_KEY` - OpenAI API key (if using AI features)

## Deployment Steps

### 1. **Install Dependencies Correctly**
   ```bash
   npm install
   ```

### 2. **Build Locally to Test**
   ```bash
   npm run build
   ```
   This will catch any build errors before deploying.

### 3. **Deploy to Vercel**

   #### Option A: Using Vercel CLI
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

   #### Option B: Using Vercel Dashboard
   1. Go to [vercel.com](https://vercel.com)
   2. Click "Add New Project"
   3. Import your Git repository
   4. Configure environment variables
   5. Click "Deploy"

### 4. **Configure Environment Variables in Vercel**
   1. Go to your project settings
   2. Navigate to "Environment Variables"
   3. Add all required variables listed above
   4. Redeploy your application

## Common Issues and Solutions

### Issue: "Module not found: Can't resolve 'fs'"
**Solution**: Already fixed by removing `fs` from package.json

### Issue: "Sharp installation failed"
**Solution**: Already fixed with `serverComponentsExternalPackages` configuration

### Issue: "Function execution timeout"
**Solution**: Already fixed with 60-second timeout in vercel.json

### Issue: "API key not configured"
**Solution**: Add the `nanoBananaApiKey` environment variable in Vercel project settings

### Issue: Build fails with "Cannot use import statement outside a module"
**Solution**: Ensure all API routes use proper ES module syntax (already implemented)

## Post-Deployment Checklist

- [ ] All environment variables are set in Vercel
- [ ] Application builds successfully locally
- [ ] Database migrations have been run (if using Prisma)
- [ ] API routes respond correctly
- [ ] Virtual try-on feature works
- [ ] Furniture visualization works
- [ ] Authentication works
- [ ] All pages load without errors

## Testing After Deployment

1. **Test Virtual Try-On**: Navigate to `/virtual-tryon` and upload test images
2. **Test Furniture Visualization**: Navigate to `/room-visualizer` and test functionality
3. **Test Authentication**: Try signing in/up
4. **Check API Routes**: Verify all API endpoints return proper responses
5. **Monitor Logs**: Check Vercel function logs for any errors

## Additional Recommendations

1. **Set up monitoring**: Use Vercel Analytics to monitor performance
2. **Configure custom domain**: Add your custom domain in Vercel settings
3. **Enable preview deployments**: Automatically deploy preview branches
4. **Set up CI/CD**: Configure GitHub Actions for automated testing
5. **Regular updates**: Keep dependencies up to date with `npm update`

## Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Check browser console for client-side errors
3. Verify all environment variables are set correctly
4. Ensure your API keys are valid and have proper permissions

## Next Steps After Successful Deployment

1. Configure production database
2. Set up email service for authentication
3. Configure payment gateway (PayPal already integrated)
4. Set up CDN for static assets
5. Enable ISR (Incremental Static Regeneration) for product pages
6. Implement proper error tracking (e.g., Sentry)

