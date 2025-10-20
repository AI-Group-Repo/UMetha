// Simple script to add test products for search testing
// Run with: node scripts/add-test-products.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const testProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life",
    price: 199.99,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
    category: "Electronics",
    stock: 50
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking watch with heart rate monitor and GPS",
    price: 299.99,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
    category: "Electronics",
    stock: 30
  },
  {
    name: "Designer Leather Handbag",
    description: "Luxury leather handbag with multiple compartments and elegant design",
    price: 599.99,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
    category: "Fashion",
    stock: 25
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable organic cotton t-shirt in various colors and sizes",
    price: 29.99,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
    category: "Fashion",
    stock: 100
  },
  {
    name: "Smart Home Speaker",
    description: "Voice-controlled smart speaker with AI assistant and high-quality sound",
    price: 149.99,
    images: ["https://images.unsplash.com/photo-1543512214-318c7553f226?w=500"],
    category: "Electronics",
    stock: 40
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat with extra cushioning and carrying strap",
    price: 79.99,
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"],
    category: "Sports",
    stock: 60
  },
  {
    name: "Coffee Maker Deluxe",
    description: "Programmable coffee maker with built-in grinder and thermal carafe",
    price: 199.99,
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500"],
    category: "Home & Living",
    stock: 35
  },
  {
    name: "Skincare Set",
    description: "Complete skincare set with cleanser, moisturizer, and serum",
    price: 89.99,
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500"],
    category: "Beauty",
    stock: 45
  }
];

async function addTestProducts() {
  try {
    console.log('Adding test products...');
    
    // First, create categories if they don't exist
    const categories = ["Electronics", "Fashion", "Sports", "Home & Living", "Beauty"];
    const categoryMap = {};
    
    for (const categoryName of categories) {
      const category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: {
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
          description: `${categoryName} products and accessories`
        }
      });
      categoryMap[categoryName] = category.id;
    }
    
    // Add products
    for (const productData of testProducts) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          images: productData.images,
          categoryId: categoryMap[productData.category],
          stock: productData.stock
        }
      });
      console.log(`Added product: ${product.name}`);
    }
    
    console.log('Test products added successfully!');
  } catch (error) {
    console.error('Error adding test products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestProducts();
