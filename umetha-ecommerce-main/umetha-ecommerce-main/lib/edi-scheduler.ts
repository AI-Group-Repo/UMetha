import ediService from "./edi-service";

/**
 * EDI Scheduler - handles periodic EDI document fetching
 * This can be called by a cron job or serverless function
 */
export async function fetchEdiUpdates() {
  console.log("Starting scheduled EDI update fetch...");
  const startTime = Date.now();

  try {
    // Process in order of priority

    // 1. Get inventory updates
    console.log("Fetching inventory updates (846)...");
    const inventory = await ediService.checkInventoryUpdates();
    console.log(
      `Inventory updates processed: ${inventory.updatesProcessed || 0}`
    );

    // 2. Get order confirmations
    console.log("Fetching order confirmations (855)...");
    const confirmations = await ediService.getOrderConfirmations();
    console.log(
      `Order confirmations processed: ${
        confirmations.confirmationsProcessed || 0
      }`
    );

    // 3. Get shipping notices
    console.log("Fetching shipping notices (856)...");
    const shipping = await ediService.getShippingNotices();
    console.log(
      `Shipping notices processed: ${shipping.noticesProcessed || 0}`
    );

    // 4. Get invoices
    console.log("Fetching invoices (810)...");
    const invoices = await ediService.getInvoices();
    console.log(`Invoices processed: ${invoices.invoicesProcessed || 0}`);

    const processingTime = (Date.now() - startTime) / 1000;
    console.log(
      `EDI updates completed successfully in ${processingTime.toFixed(2)}s`
    );

    return {
      success: true,
      processingTime: `${processingTime.toFixed(2)}s`,
      results: {
        inventory,
        confirmations,
        shipping,
        invoices,
      },
    };
  } catch (error: any) {
    console.error("Error during scheduled EDI update fetch:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
