// Direct script to add fashion products to Supabase
const { createClient } = require("@supabase/supabase-js");

// Create Supabase client
const supabase = createClient(
  "https://mhkyibdilmpvazhszczv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oa3lpYmRpbG1wdmF6aHN6Y3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODc2NzgsImV4cCI6MjA1OTk2MzY3OH0.iCy0kauk6uPAnQJClnDknbN7H6hhVm75l5o47UthHP4"
);

async function createSupplier() {
  console.log("Creating supplier...");

  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      name: "Fashion Supplier",
      email: "fashion@example.com",
      phone_number: "1234567890",
      api_endpoint: "https://api.example.com",
      date_created: new Date().toISOString(),
    })
    .select();

  if (error) {
    console.error("Error creating supplier:", error);
    throw error;
  }

  console.log("Supplier created:", data);
  return data[0].supplier_id;
}

async function addFashionProducts() {
  try {
    console.log("Getting existing suppliers...");

    // First check if we have a supplier
    let { data: suppliers, error } = await supabase
      .from("suppliers")
      .select("*");

    if (error) {
      console.error("Error fetching suppliers:", error);
      return;
    }

    let supplierId;
    if (suppliers && suppliers.length > 0) {
      console.log(`Using existing supplier: ${suppliers[0].name}`);
      supplierId = suppliers[0].supplier_id;
    } else {
      supplierId = await createSupplier();
    }

    console.log("Adding fashion products with supplier ID:", supplierId);

    // Simple products
    const products = [
      {
        name: "Silk Evening Dress",
        description:
          "Elegant silk evening dress with delicate embroidery and flattering silhouette.",
        sku: "FASH-DRESS-001",
        price: 289.99,
        supplier_id: supplierId,
        date_created: new Date().toISOString(),
        image:
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1600",
      },
      {
        name: "Designer Blazer",
        description:
          "Tailored designer blazer made from high-quality materials for a sophisticated look.",
        sku: "FASH-BLAZER-002",
        price: 499.99,
        supplier_id: supplierId,
        date_created: new Date().toISOString(),
        image:
          "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=1600",
      },
      {
        name: "Luxury Handbag",
        description:
          "Statement luxury handbag with premium hardware and spacious interior compartments.",
        sku: "FASH-BAG-003",
        price: 199.99,
        supplier_id: supplierId,
        date_created: new Date().toISOString(),
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600",
      },
      {
        name: "Statement Coat",
        description:
          "Bold statement coat that combines comfort with striking design elements.",
        sku: "FASH-COAT-004",
        price: 349.99,
        supplier_id: supplierId,
        date_created: new Date().toISOString(),
        image:
          "https://images.unsplash.com/photo-1592669241067-2f92a1048085?q=80&w=1600",
      },
    ];

    console.log("Inserting products...");
    const { data, error: insertError } = await supabase
      .from("products")
      .insert(products)
      .select();

    if (insertError) {
      console.error("Error inserting products:", insertError);
      return;
    }

    console.log("Success! Added products:", data);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

// Execute
console.log("Starting fashion product insertion...");
addFashionProducts()
  .then(() => {
    console.log("Done!");
    setTimeout(() => process.exit(0), 1000);
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
