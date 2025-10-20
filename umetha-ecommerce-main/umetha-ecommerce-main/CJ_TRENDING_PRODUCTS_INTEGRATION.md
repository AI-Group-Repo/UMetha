# CJ Dropshipping Trending Products Integration

This enhanced integration automatically fetches trending products from CJ Dropshipping every night, cleans old products, and keeps your inventory fresh with the latest trending items.

## 🚀 New Features

### ✨ **Automatic Trending Products Sync**
- **Midnight Cron Job**: Automatically syncs trending products every night at 00:00
- **Product Cleanup**: Deletes old CJ products before adding new ones
- **Fresh Inventory**: Always displays the latest trending products
- **Error Handling**: Robust error handling and retry mechanisms

### 🔄 **Complete Sync Process**
1. **Delete Old Products**: Removes all existing CJ Dropshipping products
2. **Fetch Trending**: Gets the latest trending products from CJ API
3. **Save New Products**: Stores fresh products in Supabase
4. **Search Integration**: Products appear immediately in search results

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install node-cron @types/node-cron
```

### 2. Environment Configuration
Add your CJ API key to `.env.local`:
```bash
CJ_API_KEY=your_actual_cj_api_key_here
```

### 3. Database Schema
Ensure your Supabase products table has these columns:
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_product_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_product_link TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier TEXT DEFAULT 'Local';
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_product_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_dropshipping BOOLEAN DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_cj_product_id ON products(cj_product_id);
```

## 🎯 Usage

### Automatic Sync (Recommended)
Start the cron scheduler to run automatically every midnight:
```bash
npm run cj-cron
```

This will:
- ✅ Run trending products sync every night at 00:00
- ✅ Delete old CJ products before adding new ones
- ✅ Keep your inventory fresh with trending items
- ✅ Log all operations for monitoring

### Manual Sync via Dashboard
Visit `http://localhost:3000/cj-dashboard` and use:
- **Sync Trending Products**: Manual trending products sync
- **Cleanup Old Products**: Delete old CJ products
- **Start Scheduler**: Enable automatic midnight sync

### API Endpoints

#### Sync Trending Products
```bash
GET /api/sync/cj-products?action=trending&limit=50
```

#### Cleanup Old Products
```bash
GET /api/sync/cj-products?action=cleanup
```

#### Test Connection
```bash
GET /api/sync/cj-products?action=test
```

## 🔧 Configuration

### Cron Schedule
The default schedule runs every midnight (00:00 UTC). To modify:

```javascript
// In lib/cj-cron-scheduler.ts
cron.schedule("0 0 * * *", async () => {
  // Your sync logic here
});
```

### Product Limits
- **Default**: 50 trending products per sync
- **Configurable**: Adjust via API parameters or dashboard
- **Maximum**: 100 products per sync (API limit)

### Sync Keywords
The system uses "trending" as the default keyword to fetch the most popular products from CJ Dropshipping.

## 📊 Monitoring

### Console Logs
All operations are logged with timestamps:
```
==============================
🕛 Starting CJ trending product sync at 10/17/2025, 7:57:52 PM
==============================
🗑️ Deleting old CJ Dropshipping products...
✅ Old CJ products deleted successfully
🔥 Fetching trending products from CJ Dropshipping...
✅ Fetched 50 trending products
✅ Synced 50 trending products
✅ Trending product sync completed successfully!
==============================
```

### Dashboard Status
- **Connection Status**: Test CJ API connectivity
- **Scheduler Status**: Check if cron job is running
- **Last Sync**: View sync results and statistics

## 🛠️ Scripts

### Start Cron Scheduler
```bash
npm run cj-cron
```
Runs the trending products sync every midnight.

### Demo Sync
```bash
npm run cj-demo
```
Demonstrates the complete sync process with mock data.

## 🔍 How It Works

### 1. Midnight Trigger
- Cron job triggers at 00:00 UTC every day
- Checks if sync is already running to prevent duplicates
- Logs the start of sync operation

### 2. Product Cleanup
- Deletes all existing CJ Dropshipping products
- Ensures fresh inventory every day
- Prevents duplicate products

### 3. Trending Fetch
- Calls CJ Dropshipping API with "trending" keyword
- Fetches the latest popular products
- Handles API rate limits and errors

### 4. Data Processing
- Transforms CJ product format to your schema
- Adds dropshipping metadata
- Prepares for database storage

### 5. Database Storage
- Uses upsert to prevent duplicates
- Stores with proper categorization
- Updates timestamps

### 6. Search Integration
- Products become available immediately
- Search API prioritizes CJ products
- Full search and filter functionality

## 🚨 Troubleshooting

### Common Issues

1. **Cron Job Not Running**
   - Check if the process is running: `ps aux | grep cj-cron`
   - Verify environment variables are set
   - Check console logs for errors

2. **API Connection Issues**
   - Verify CJ_API_KEY is correct
   - Check network connectivity
   - Test connection via dashboard

3. **Database Errors**
   - Ensure Supabase schema is updated
   - Check database permissions
   - Verify table structure

### Debug Mode
Enable detailed logging by setting `NODE_ENV=development`.

## 📈 Performance

### Optimization Tips
- **Batch Size**: 50 products per sync is optimal
- **Sync Frequency**: Once daily prevents API overload
- **Error Handling**: Automatic retry on failures
- **Memory Usage**: Minimal memory footprint

### API Limits
- **CJ Dropshipping**: Rate limits apply
- **Token Expiry**: Automatically refreshed
- **Sync Duration**: Typically 30-60 seconds

## 🔐 Security

- **API Keys**: Stored in environment variables
- **Database**: Secure Supabase connection
- **Logging**: No sensitive data in logs
- **Access**: Dashboard requires authentication

## 🎉 Benefits

### For Your Business
- ✅ **Always Fresh**: Latest trending products daily
- ✅ **Automated**: No manual intervention needed
- ✅ **Scalable**: Handles large product catalogs
- ✅ **Reliable**: Robust error handling

### For Your Customers
- ✅ **Current Products**: See what's trending now
- ✅ **Variety**: New products every day
- ✅ **Quality**: Curated trending items
- ✅ **Availability**: Real-time inventory

## 📝 Example Workflow

### Daily Automation
1. **00:00**: Cron job triggers
2. **00:01**: Delete old CJ products
3. **00:02**: Fetch 50 trending products
4. **00:03**: Save to Supabase
5. **00:04**: Products available in search
6. **00:05**: Sync complete, log results

### Manual Override
- Use dashboard for immediate sync
- Adjust product limits as needed
- Monitor sync status and errors
- Force cleanup when necessary

## 🚀 Getting Started

1. **Set up environment variables**
2. **Update database schema**
3. **Start the cron scheduler**: `npm run cj-cron`
4. **Monitor via dashboard**: `http://localhost:3000/cj-dashboard`
5. **Enjoy fresh trending products daily!**

Your e-commerce store will now automatically stay updated with the latest trending products from CJ Dropshipping, providing your customers with fresh, popular items every day!

