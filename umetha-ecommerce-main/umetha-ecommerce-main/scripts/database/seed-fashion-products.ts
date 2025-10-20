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
      name: "Umetha Fashion Supplier",
      email: "fashion-supplier@umetha.com",
      phone_number: "+1234567891",
      api_endpoint: "https://api.fashion-supplier.umetha.com",
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

// Fashion products data from the fashion page
const featuredCollections = [
  {
    title: "Modern Elegance",
    subtitle: "Discover timeless sophistication",
    image:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1472",
    badge: "New Season",
  },
  {
    title: "Urban Style",
    subtitle: "Contemporary fashion for city life",
    image:
      "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1470",
    badge: "Trending Now",
  },
  {
    title: "Luxury Collection",
    subtitle: "Premium pieces for distinguished taste",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1587",
    badge: "Exclusive",
  },
];

const trendingItems = [
  {
    name: "Silk Evening Dress",
    price: 289.99,
    originalPrice: 349.99,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1600",
    tag: "Best Seller",
    category: "fashion",
    description:
      "Elegant silk evening dress with delicate embroidery and flattering silhouette.",
  },
  {
    name: "Designer Blazer",
    price: 499.99,
    originalPrice: 599.99,
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=1600",
    tag: "Premium",
    category: "fashion",
    description:
      "Tailored designer blazer made from high-quality materials for a sophisticated look.",
  },
  {
    name: "Luxury Handbag",
    price: 199.99,
    originalPrice: 249.99,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600",
    tag: "New Arrival",
    category: "fashion",
    description:
      "Statement luxury handbag with premium hardware and spacious interior compartments.",
  },
  {
    name: "Statement Coat",
    price: 349.99,
    originalPrice: 429.99,
    image:
      "https://images.unsplash.com/photo-1592669241067-2f92a1048085?q=80&w=1600",
    tag: "Limited Edition",
    category: "fashion",
    description:
      "Bold statement coat that combines comfort with striking design elements.",
  },
  {
    name: "Summer Dress",
    price: 159.99,
    originalPrice: 199.99,
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1600",
    tag: "Trending",
    category: "fashion",
    description:
      "Light and flowy summer dress in breathable fabric, perfect for warm days.",
  },
  {
    name: "Classic Suit",
    price: 799.99,
    originalPrice: 999.99,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600",
    tag: "Premium",
    category: "fashion",
    description:
      "Timeless classic suit with exquisite tailoring and premium wool fabric.",
  },
  {
    name: "Designer Boots",
    price: 299.99,
    originalPrice: 379.99,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1600",
    tag: "New Season",
    category: "fashion",
    description:
      "Designer boots crafted from genuine leather with durable soles for lasting comfort.",
  },
  {
    name: "Casual Ensemble",
    price: 249.99,
    originalPrice: 299.99,
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1600",
    tag: "Essential",
    category: "fashion",
    description:
      "Versatile casual ensemble that creates an effortlessly stylish look for everyday wear.",
  },
];

// Format products for database
const convertToProducts = (items, supplierId) => {
  return items.map((item, index) => ({
    name: item.name,
    description: item.description || `${item.name} - ${item.tag}`,
    sku: `FASH-${index + 1000}`,
    price: item.price,
    supplier_id: supplierId,
    date_created: new Date().toISOString(),
    image: item.image,
  }));
};

// Add products to database
export async function seedFashionProducts() {
  try {
    // Get or create supplier
    const supplierId = await addDefaultSupplier();

    // Check for existing products to avoid duplicates
    const { data: existingProducts } = await supabase
      .from("products")
      .select("name, sku")
      .eq("supplier_id", supplierId);

    const existingNames = existingProducts?.map((p) => p.name) || [];

    // Filter out products that already exist
    const formattedProducts = convertToProducts(trendingItems, supplierId);
    const newProducts = formattedProducts.filter(
      (p) => !existingNames.includes(p.name)
    );

    if (newProducts.length === 0) {
      console.log("All fashion products already exist in the database.");
      return {
        success: true,
        message: "All fashion products already exist in the database.",
      };
    }

    // Insert products
    const { data, error } = await supabase
      .from("products")
      .insert(newProducts)
      .select();

    if (error) {
      throw error;
    }

    console.log(`Successfully added ${data.length} new fashion products:`);
    data.forEach((p) => console.log(`- ${p.name} (SKU: ${p.sku})`));

    return { success: true, added: data.length, products: data };
  } catch (error) {
    console.error("Error seeding fashion products:", error);
    return { success: false, error };
  }
}

// Export the function for API usage
export default seedFashionProducts;
