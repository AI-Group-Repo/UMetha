import { supabase } from "../../lib/supabase";

// First, let's add a supplier if none exists
async function addDefaultSupplier() {
  // Check if supplier exists
  const { data: existingSuppliers } = await supabase
    .from("suppliers")
    .select("*")
    .limit(1);

  if (existingSuppliers && existingSuppliers.length > 0) {
    console.log(`Using existing supplier: ${existingSuppliers[0].name}`);
    return existingSuppliers[0].supplier_id;
  }

  // Add a default supplier
  const { data: supplier, error } = await supabase
    .from("suppliers")
    .insert({
      name: "Umetha Main Supplier",
      email: "supplier@umetha.com",
      phone_number: "+1234567890",
      api_endpoint: "https://api.supplier.umetha.com",
      date_created: new Date().toISOString(),
    })
    .select();

  if (error) {
    console.error("Error adding supplier:", error);
    throw error;
  }

  console.log(`Created new supplier: ${supplier[0].name}`);
  return supplier[0].supplier_id;
}

// Product data based on the images in your public folder
const products = [
  {
    name: "Galaxy S25 Ultra",
    description:
      "The latest Samsung flagship smartphone with advanced camera system and powerful processor.",
    sku: "SAMS-GS25U-001",
    price: 1199.99,
    image: "/GalaxyS25Ultra.jpeg",
    category: "Electronics",
  },
  {
    name: "MacBook Pro",
    description:
      "High-performance laptop for professionals with stunning display and long battery life.",
    sku: "APPL-MBP-001",
    price: 1999.99,
    image: "/laptops.jpeg",
    category: "Electronics",
  },
  {
    name: "Premium DSLR Camera",
    description:
      "Professional-grade camera with high-resolution sensor and 4K video recording capabilities.",
    sku: "CAM-DSLR-001",
    price: 899.99,
    image: "/camera.jpeg",
    category: "Electronics",
  },
  {
    name: "Wireless Earpods",
    description:
      "True wireless earbuds with noise cancellation and crystal clear sound quality.",
    sku: "AUD-EARP-001",
    price: 149.99,
    image: "/earpods.jpeg",
    category: "Electronics",
  },
  {
    name: "Luxury Scarf",
    description:
      "Premium silk scarf with elegant design, perfect for any formal occasion.",
    sku: "FASH-SCRF-001",
    price: 89.99,
    image: "/scarf.jpg",
    category: "Fashion",
  },
  {
    name: "Designer Shoes",
    description:
      "Handcrafted leather shoes combining style and comfort for the modern professional.",
    sku: "FASH-SHOE-001",
    price: 299.99,
    image: "/shoes.jpg",
    category: "Fashion",
  },
  {
    name: "Gucci Handbag",
    description:
      "Authentic designer handbag with iconic pattern and exceptional craftsmanship.",
    sku: "GUCC-BAG-001",
    price: 1299.99,
    image: "/Gucci.jpg",
    category: "Fashion",
  },
  {
    name: "Crossbody Bag",
    description:
      "Stylish and functional crossbody bag perfect for everyday use.",
    sku: "FASH-CBAG-001",
    price: 119.99,
    image: "/crossbag.webp",
    category: "Fashion",
  },
  {
    name: "Modern Chair",
    description:
      "Ergonomic chair with contemporary design, adding style and comfort to any room.",
    sku: "HOME-CHAIR-001",
    price: 249.99,
    image: "/chair.jpg",
    category: "Home",
  },
  {
    name: "Stand Mixer",
    description:
      "Professional kitchen mixer with multiple attachments for all your baking needs.",
    sku: "HOME-MIXER-001",
    price: 349.99,
    image: "/mixer.jpg",
    category: "Home",
  },
  {
    name: "Home Security System",
    description:
      "Advanced security system with motion sensors and smartphone integration.",
    sku: "TECH-SEC-001",
    price: 399.99,
    image: "/security.jpeg",
    category: "Electronics",
  },
  {
    name: "Premium Headphones",
    description:
      "Over-ear headphones with active noise cancellation and high-fidelity sound.",
    sku: "AUD-HEAD-001",
    price: 249.99,
    image: "/headphone.webp",
    category: "Electronics",
  },
  {
    name: "Portable Power Bank",
    description:
      "Fast-charging power bank with large capacity and multiple ports.",
    sku: "TECH-PWBK-001",
    price: 59.99,
    image: "/powerbank.jpeg",
    category: "Electronics",
  },
  {
    name: "Gaming Console",
    description:
      "Next-generation gaming console with immersive graphics and extensive game library.",
    sku: "GAME-CONS-001",
    price: 499.99,
    image: "/gaming.png",
    category: "Electronics",
  },
  {
    name: "4K Smart TV",
    description:
      "65-inch smart TV with vibrant display and integrated streaming services.",
    sku: "TV-4KSM-001",
    price: 799.99,
    image: "/LG-TV.jpeg",
    category: "Electronics",
  },
];

// Add products to database
export async function seedProducts() {
  try {
    // Get or create supplier
    const supplierId = await addDefaultSupplier();

    // Check for existing products to avoid duplicates
    const { data: existingProducts } = await supabase
      .from("products")
      .select("sku");

    const existingSkus = existingProducts?.map((p) => p.sku) || [];

    // Filter out products that already exist
    const newProducts = products.filter((p) => !existingSkus.includes(p.sku));

    if (newProducts.length === 0) {
      console.log("All products already exist in the database.");
      return {
        success: true,
        message: "All products already exist in the database.",
      };
    }

    // Format products for insertion
    const productsToInsert = newProducts.map((product) => ({
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      supplier_id: supplierId,
      date_created: new Date().toISOString(),
    }));

    // Insert products
    const { data, error } = await supabase
      .from("products")
      .insert(productsToInsert)
      .select();

    if (error) {
      throw error;
    }

    console.log(`Successfully added ${data.length} new products:`);
    data.forEach((p) => console.log(`- ${p.name} (SKU: ${p.sku})`));

    return { success: true, added: data.length, products: data };
  } catch (error) {
    console.error("Error seeding products:", error);
    return { success: false, error };
  }
}

// Export the function for API usage
export default seedProducts;
