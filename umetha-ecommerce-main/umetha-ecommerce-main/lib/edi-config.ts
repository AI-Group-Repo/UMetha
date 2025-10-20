/**
 * EDI service provider configuration
 * This file contains settings for connecting to the EDI service provider
 */

export const ediConfig = {
  provider: {
    name: process.env.EDI_PROVIDER_NAME || "SPS_COMMERCE",
    baseUrl: process.env.EDI_API_BASE_URL || "https://api.spscommerce.com/v1",
    apiKey: process.env.EDI_API_KEY,
    apiSecret: process.env.EDI_API_SECRET,
    companyId: process.env.EDI_COMPANY_ID,
  },
  webhookSecret: process.env.EDI_WEBHOOK_SECRET,
  schedulerApiKey: process.env.EDI_SCHEDULER_API_KEY,
  documentTypes: {
    INVENTORY_UPDATE: "846",
    PURCHASE_ORDER: "850",
    ORDER_CONFIRMATION: "855",
    SHIPPING_NOTICE: "856",
    INVOICE: "810",
    PAYMENT_ADVICE: "820",
  },
  // Time in ms to wait before retrying failed EDI transmissions
  retryIntervals: [60000, 300000, 900000], // 1min, 5min, 15min

  // Define which trading partners are enabled for EDI
  tradingPartners: {
    // Format: partnerId: { name: 'Partner Name', documentTypes: ['850', '855'] }
    // Will be populated from environment variables or database
  },
};

export default ediConfig;
