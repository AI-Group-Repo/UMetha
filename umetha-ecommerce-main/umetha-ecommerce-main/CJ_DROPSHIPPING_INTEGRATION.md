# CJ Dropshipping Integration

This document explains how to integrate CJ Dropshipping as your AI dropshipping and supplier API to fetch products and store them in Supabase.

## 🚀 Features

- **Automatic Product Sync**: Sync products from CJ Dropshipping to your Supabase database
- **Scheduled Sync**: Automatically sync products at regular intervals
- **Real-time Search**: Products appear in your search results immediately after sync
- **Dashboard Management**: Web interface to manage sync operations
- **Error Handling**: Robust error handling and retry mechanisms
- **Product Deduplication**: Prevents duplicate products using CJ product IDs

## 📋 Prerequisites

1. **CJ Dropshipping Account**: Sign up at [CJ Dropshipping](https://www.cjdropshipping.com/)
2. **CJ API Key**: Get your API key from [CJ Developers](https://developers.cjdropshipping.com/)
3. **Supabase Database**: Your existing Supabase setup

## 🔧 Setup Instructions

### 1. Environment Configuration

Add your CJ API key to `.env.local`:

```bash
# CJ Dropshipping API Configuration
CJ_API_KEY=your_actual_cj_api_key_here

# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://zgdwrrsqjdlxfwjqamxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZHdycnNxamRseGZ3anFhbXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzkzNDUsImV4cCI6MjA3NjAxNTM0NX0._4EEFOEIJ6vZMc0aGbgXfmmVi-WedTX6HpTDW4dLeOs
```

### 2. Database Schema Updates

Run these SQL commands in your Supabase SQL editor to add CJ-specific columns:

```sql
-- Add CJ Dropshipping columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_product_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_product_link TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier TEXT DEFAULT 'Local';
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_product_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_dropshipping BOOLEAN DEFAULT false;

-- Create unique index for CJ products
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_cj_product_id ON products(cj_product_id);
```

### 3. Install Dependencies

The integration uses existing dependencies. No additional packages are required.

## 🎯 Usage

### Dashboard Interface

Visit `http://localhost:3000/cj-dashboard` to access the CJ Dropshipping management dashboard.

Features:
- **Test Connection**: Verify your CJ API key is working
- **Sync Products**: Manually sync products from CJ Dropshipping
- **Scheduler Management**: Start/stop automatic syncing
- **Configuration**: Set keywords, limits, and sync intervals

### API Endpoints

#### Test Connection
```bash
GET /api/sync/cj-products?action=test
```

#### Get Categories
```bash
GET /api/sync/cj-products?action=categories
```

#### Sync Products
```bash
GET /api/sync/cj-products?keywords=fashion,electronics&limit=20
```

#### Scheduler Management
```bash
# Start scheduler
POST /api/sync/scheduler?action=start
Content-Type: application/json
{
  "keywords": ["fashion", "electronics", "home", "beauty"],
  "productsPerKeyword": 15,
  "intervalHours": 6,
  "enabled": true
}

# Stop scheduler
POST /api/sync/scheduler?action=stop

# Force sync
POST /api/sync/scheduler?action=force
Content-Type: application/json
{
  "keywords": ["fashion", "electronics"],
  "productsPerKeyword": 10
}
```

## 🔄 How It Works

### 1. Product Sync Process

1. **Authentication**: Get access token from CJ Dropshipping API
2. **Product Fetching**: Fetch products based on keywords
3. **Data Transformation**: Convert CJ product format to your database schema
4. **Database Storage**: Store products in Supabase with deduplication
5. **Search Integration**: Products become available in search results

### 2. Search Priority

The search API now prioritizes products in this order:
1. **CJ Dropshipping Products** (is_dropshipping = true)
2. **Regular Products** (is_dropshipping = false)
3. **Sample Products** (fallback when database is empty)

### 3. Product Schema

CJ products are stored with these additional fields:
- `cj_product_id`: Unique CJ product identifier
- `cj_product_link`: Link to product on CJ platform
- `cj_category`: Category from CJ Dropshipping
- `supplier`: Set to "CJ Dropshipping"
- `supplier_product_id`: CJ's internal product ID
- `is_dropshipping`: Boolean flag for dropshipping products

## 📊 Monitoring

### Sync Status
- Check sync status via dashboard or API
- Monitor sync errors and success rates
- View last sync results and statistics

### Logs
- All sync operations are logged to console
- Error details are captured and displayed
- Sync timing and performance metrics

## 🛠️ Configuration Options

### Sync Keywords
Default: `["fashion", "electronics", "home", "beauty", "sports"]`

### Products Per Keyword
Default: `15` (adjustable via dashboard)

### Sync Interval
Default: `6 hours` (adjustable via dashboard)

### Product Limits
- Maximum 50 products per keyword per sync
- Configurable via API parameters

## 🔍 Search Integration

CJ Dropshipping products are automatically integrated into your search system:

- **Search API**: `/api/search/products` now includes CJ products
- **Filtering**: Products can be filtered by supplier, category, etc.
- **Pagination**: Full pagination support for large product catalogs
- **Real-time**: Products appear immediately after sync

## 🚨 Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Verify your CJ API key is correct
   - Check if the key has expired
   - Ensure you have the right permissions

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check if the products table exists
   - Ensure all required columns are added

3. **Sync Failures**
   - Check network connectivity
   - Verify CJ API is accessible
   - Review error logs for specific issues

### Debug Mode

Enable detailed logging by setting `NODE_ENV=development` in your environment.

## 📈 Performance

### Optimization Tips

1. **Batch Size**: Adjust products per keyword based on your needs
2. **Sync Frequency**: Balance between fresh products and API limits
3. **Caching**: Token caching reduces API calls
4. **Error Handling**: Robust retry mechanisms prevent data loss

### API Limits

- CJ Dropshipping has rate limits
- Token expires every 2 hours (automatically refreshed)
- Recommended sync interval: 6+ hours

## 🔐 Security

- API keys are stored in environment variables
- No sensitive data is logged
- Secure token management with automatic renewal
- Database operations use prepared statements

## 📝 Example Usage

### Manual Product Sync
```javascript
// Sync fashion products
const response = await fetch('/api/sync/cj-products?keywords=fashion&limit=20');
const result = await response.json();
console.log(`Synced ${result.data.totalProducts} products`);
```

### Start Automatic Sync
```javascript
// Start scheduler with custom config
const response = await fetch('/api/sync/scheduler?action=start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    keywords: ['fashion', 'electronics'],
    productsPerKeyword: 25,
    intervalHours: 4
  })
});
```

## 🎉 Success!

Once set up, your e-commerce application will:

1. ✅ Automatically sync products from CJ Dropshipping
2. ✅ Display real products in search results
3. ✅ Manage inventory and product information
4. ✅ Provide a seamless dropshipping experience
5. ✅ Scale with your business needs

Visit `http://localhost:3000/cj-dashboard` to get started!

