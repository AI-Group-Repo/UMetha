# Vercel Deployment Checklist for UMetha E-Commerce

This is your complete guide to deploying UMetha E-Commerce to Vercel.

## Pre-Deployment Checklist

### 1. Code Preparation ✅
- [x] Removed hardcoded credentials from source code
- [x] Updated `next.config.js` for production
- [x] Updated `vercel.json` with proper configuration
- [x] Environment variables documented in `ENV_VARIABLES.md`

### 2. Required Environment Variables

Before deploying, prepare these environment variables:

#### Essential (Required for basic functionality):
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Generate using: `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - Your deployed URL (e.g., https://your-app.vercel.app)

#### Important Features:
- [ ] `nanoBananaApiKey` - Google Gemini API for virtual try-on (required for VTO feature)
- [ ] `OPENAI_API_KEY` - OpenAI for AI chatbot (optional)
- [ ] `REMOVE_BG_API_KEY` - Background removal API (optional)

#### Payment Processing (if applicable):
- [ ] `PAYPAL_CLIENT_ID` - PayPal client ID
- [ ] `PAYPAL_CLIENT_SECRET` - PayPal client secret
- [ ] `PAYPAL_MODE` - Set to `live` for production

#### Dropshipping Integration (if applicable):
- [ ] `CJ_API_KEY` - CJ Dropshipping API key
- [ ] `CLICKBANK_API_KEY` - ClickBank API key

### 3. Database Setup
- [ ] Supabase project is created and configured
- [ ] Database migrations have been run
- [ ] Tables are properly set up (products, users, orders, etc.)
- [ ] RLS (Row Level Security) policies are configured
- [ ] Test data is added (if needed)

## Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with your account
   - Click "Add New Project"

3. **Import Your Repository**
   - Select your Git provider
   - Find and import your UMetha repository
   - Click "Import"

4. **Configure Your Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all required variables from the list above
   - For each variable:
     - Enter the key name
     - Enter the value
     - Select environments: Production, Preview, Development
   - Click "Add" for each variable

6. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (5-10 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Preview**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

5. **Add Environment Variables via CLI**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   # ... repeat for all variables
   ```

## Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Site loads successfully
- [ ] No console errors in browser
- [ ] Images load correctly
- [ ] Navigation works

### 2. Test Core Features
- [ ] **Authentication**
  - [ ] Sign up works
  - [ ] Sign in works
  - [ ] Password reset works
  - [ ] User profile loads

- [ ] **Product Pages**
  - [ ] Products list loads
  - [ ] Product details page works
  - [ ] Product search works
  - [ ] Product filtering works
  - [ ] Language switching works

- [ ] **Shopping Cart**
  - [ ] Add to cart works
  - [ ] Cart updates correctly
  - [ ] Checkout process works

- [ ] **Virtual Try-On** (if enabled)
  - [ ] Upload images works
  - [ ] AI processing completes
  - [ ] Results display correctly

- [ ] **Furniture Visualization** (if enabled)
  - [ ] Room upload works
  - [ ] Furniture placement works
  - [ ] Results display correctly

- [ ] **Dashboard** (if applicable)
  - [ ] Admin dashboard loads
  - [ ] Seller dashboard loads
  - [ ] Influencer dashboard loads

### 3. Performance Check
- [ ] Check Vercel Analytics
- [ ] Run Lighthouse audit
- [ ] Test on mobile devices
- [ ] Check page load times

### 4. Monitor for Issues
- [ ] Check Vercel function logs
- [ ] Monitor error rates
- [ ] Check database connections
- [ ] Verify API rate limits

## Common Issues and Solutions

### Issue: Build Fails
**Error**: `Module not found: Can't resolve ...`
**Solution**: 
- Check that all dependencies are in `package.json`
- Run `npm install` locally and commit `package-lock.json`
- Ensure TypeScript errors are fixed

### Issue: Environment Variables Not Working
**Error**: `undefined` or `null` values for env vars
**Solution**:
- Verify variables are added in Vercel dashboard
- Ensure client-side variables start with `NEXT_PUBLIC_`
- Redeploy after adding new variables

### Issue: Database Connection Fails
**Error**: `Connection timeout` or `Connection refused`
**Solution**:
- Check `DATABASE_URL` is correct
- Verify Supabase project is active
- Check network restrictions in Supabase settings

### Issue: API Routes Timeout
**Error**: `Function execution timed out`
**Solution**:
- Already configured 60-second timeout in `vercel.json`
- Optimize API calls
- Consider caching strategies

### Issue: Images Not Loading
**Error**: `Failed to load resource` for images
**Solution**:
- Check image URLs are correct
- Verify `remotePatterns` in `next.config.js`
- Ensure images are accessible

## Custom Domain Setup

1. **Go to Project Settings**
   - Vercel Dashboard > Your Project > Settings > Domains

2. **Add Custom Domain**
   - Enter your domain name
   - Click "Add"

3. **Configure DNS**
   - Add A record or CNAME record as instructed by Vercel
   - Wait for DNS propagation (up to 48 hours)

4. **Update Environment Variables**
   - Update `NEXTAUTH_URL` to your custom domain
   - Redeploy

## Performance Optimization

### 1. Enable Vercel Analytics
- Go to Project Settings > Analytics
- Enable Web Analytics
- Monitor Core Web Vitals

### 2. Configure Caching
- Already configured in `next.config.js`
- ISR (Incremental Static Regeneration) for product pages
- Edge caching for static assets

### 3. Image Optimization
- Vercel automatically optimizes images
- Use Next.js `<Image>` component (already implemented)
- Set appropriate cache TTL

### 4. Database Optimization
- Use connection pooling
- Implement database indexes
- Cache frequently accessed data

## Monitoring and Maintenance

### 1. Set Up Monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (consider Sentry)
- [ ] Monitor function logs
- [ ] Set up uptime monitoring

### 2. Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Review and rotate API keys
- [ ] Monitor database size
- [ ] Check for security updates

### 3. Backup Strategy
- [ ] Regular database backups (Supabase handles this)
- [ ] Export important data periodically
- [ ] Version control for code

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for dev/prod
   - Rotate sensitive keys regularly

2. **API Keys**
   - Restrict API keys to specific domains
   - Monitor API usage
   - Set rate limits

3. **Database Security**
   - Enable RLS in Supabase
   - Use service role key only server-side
   - Regular security audits

4. **HTTPS**
   - Vercel provides SSL automatically
   - Enforce HTTPS redirects

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Vercel Community**: https://github.com/vercel/next.js/discussions

## Emergency Rollback

If something goes wrong:

1. **Via Dashboard**
   - Go to Deployments
   - Find the last working deployment
   - Click "..." menu
   - Select "Promote to Production"

2. **Via CLI**
   ```bash
   vercel rollback
   ```

## Success Criteria

Your deployment is successful when:
- [ ] All pages load without errors
- [ ] All environment variables are configured
- [ ] Core features work as expected
- [ ] Performance metrics are good (Lighthouse score > 80)
- [ ] No console errors
- [ ] Mobile experience is smooth
- [ ] API routes respond correctly
- [ ] Database operations work
- [ ] Authentication works
- [ ] Payment processing works (if enabled)

## Next Steps After Deployment

1. **Announce Your Launch** 🎉
   - Share on social media
   - Email your users
   - Update marketing materials

2. **Monitor Performance**
   - Watch Vercel Analytics
   - Monitor error logs
   - Track user feedback

3. **Iterate and Improve**
   - Fix reported bugs
   - Add new features
   - Optimize performance

---

**Need Help?**
- Check Vercel function logs for errors
- Review browser console for client-side issues
- Consult the documentation links above
- Contact Vercel support if needed

Good luck with your deployment! 🚀

