const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://zgdwrrsqjdlxfwjqamxk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZHdycnNxamRseGZ3anFhbXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzkzNDUsImV4cCI6MjA3NjAxNTM0NX0._4EEFOEIJ6vZMc0aGbgXfmmVi-WedTX6HpTDW4dLeOs';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample products with translations
const sampleProducts = [
  {
    name: "Urban Backpack",
    description: "Your journey, elevated",
    price: 59.99,
    images: ["/products/urban-backpack.jpg"],
    category: "Bags & Accessories",
    stock: 50,
    translations: [
      {
        language: "en",
        name: "Urban Backpack",
        description: "Your journey, elevated"
      },
      {
        language: "es",
        name: "Mochila Urbana",
        description: "Tu viaje, elevado"
      },
      {
        language: "fr",
        name: "Sac à Dos Urbain",
        description: "Votre voyage, élevé"
      },
      {
        language: "de",
        name: "Urbaner Rucksack",
        description: "Ihre Reise, erhöht"
      },
      {
        language: "zh",
        name: "都市背包",
        description: "您的旅程，升华"
      },
      {
        language: "hi",
        name: "अर्बन बैकपैक",
        description: "आपकी यात्रा, उन्नत"
      },
      {
        language: "ar",
        name: "حقيبة ظهر حضرية",
        description: "رحلتك، مرفوعة"
      }
    ]
  },
  {
    name: "Wireless Headphones",
    description: "Premium sound experience",
    price: 129.99,
    images: ["/products/wireless-headphones.jpg"],
    category: "Electronics",
    stock: 30,
    translations: [
      {
        language: "en",
        name: "Wireless Headphones",
        description: "Premium sound experience"
      },
      {
        language: "es",
        name: "Auriculares Inalámbricos",
        description: "Experiencia de sonido premium"
      },
      {
        language: "fr",
        name: "Casque Sans Fil",
        description: "Expérience sonore premium"
      },
      {
        language: "de",
        name: "Kabellose Kopfhörer",
        description: "Premium-Klangerlebnis"
      },
      {
        language: "zh",
        name: "无线耳机",
        description: "优质音效体验"
      },
      {
        language: "hi",
        name: "वायरलेस हेडफोन",
        description: "प्रीमियम ध्वनि अनुभव"
      },
      {
        language: "ar",
        name: "سماعات لاسلكية",
        description: "تجربة صوتية متميزة"
      }
    ]
  },
  {
    name: "Smart Watch",
    description: "Track your fitness goals",
    price: 199.99,
    images: ["/products/smart-watch.jpg"],
    category: "Electronics",
    stock: 25,
    translations: [
      {
        language: "en",
        name: "Smart Watch",
        description: "Track your fitness goals"
      },
      {
        language: "es",
        name: "Reloj Inteligente",
        description: "Rastrea tus objetivos de fitness"
      },
      {
        language: "fr",
        name: "Montre Connectée",
        description: "Suivez vos objectifs de fitness"
      },
      {
        language: "de",
        name: "Smartwatch",
        description: "Verfolgen Sie Ihre Fitnessziele"
      },
      {
        language: "zh",
        name: "智能手表",
        description: "追踪您的健身目标"
      },
      {
        language: "hi",
        name: "स्मार्ट वॉच",
        description: "अपने फिटनेस लक्ष्यों को ट्रैक करें"
      },
      {
        language: "ar",
        name: "ساعة ذكية",
        description: "تتبع أهداف اللياقة البدنية"
      }
    ]
  },
  {
    name: "Coffee Maker",
    description: "Perfect brew every time",
    price: 89.99,
    images: ["/products/coffee-maker.jpg"],
    category: "Home & Kitchen",
    stock: 40,
    translations: [
      {
        language: "en",
        name: "Coffee Maker",
        description: "Perfect brew every time"
      },
      {
        language: "es",
        name: "Cafetera",
        description: "Infusión perfecta cada vez"
      },
      {
        language: "fr",
        name: "Machine à Café",
        description: "Infusion parfaite à chaque fois"
      },
      {
        language: "de",
        name: "Kaffeemaschine",
        description: "Perfekte Zubereitung jedes Mal"
      },
      {
        language: "zh",
        name: "咖啡机",
        description: "每次都能完美冲泡"
      },
      {
        language: "hi",
        name: "कॉफी मेकर",
        description: "हर बार परफेक्ट ब्रू"
      },
      {
        language: "ar",
        name: "صانع القهوة",
        description: "تخمير مثالي في كل مرة"
      }
    ]
  },
  {
    name: "Yoga Mat",
    description: "Find your inner peace",
    price: 39.99,
    images: ["/products/yoga-mat.jpg"],
    category: "Sports & Fitness",
    stock: 60,
    translations: [
      {
        language: "en",
        name: "Yoga Mat",
        description: "Find your inner peace"
      },
      {
        language: "es",
        name: "Alfombra de Yoga",
        description: "Encuentra tu paz interior"
      },
      {
        language: "fr",
        name: "Tapis de Yoga",
        description: "Trouvez votre paix intérieure"
      },
      {
        language: "de",
        name: "Yogamatte",
        description: "Finden Sie Ihren inneren Frieden"
      },
      {
        language: "zh",
        name: "瑜伽垫",
        description: "寻找内心的平静"
      },
      {
        language: "hi",
        name: "योग मैट",
        description: "अपनी आंतरिक शांति खोजें"
      },
      {
        language: "ar",
        name: "سجادة يوغا",
        description: "اعثر على سلامك الداخلي"
      }
    ]
  }
];

async function seedProducts() {
  try {
    console.log('Starting to seed products...');

    // First, let's create some categories if they don't exist
    const categories = [
      { name: "Bags & Accessories", slug: "bags-accessories" },
      { name: "Electronics", slug: "electronics" },
      { name: "Home & Kitchen", slug: "home-kitchen" },
      { name: "Sports & Fitness", slug: "sports-fitness" }
    ];

    const categoryMap = {};

    for (const category of categories) {
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category.slug)
        .single();

      if (!existingCategory) {
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({
            name: category.name,
            slug: category.slug,
            description: `${category.name} products`
          })
          .select()
          .single();

        if (categoryError) {
          console.error('Error creating category:', categoryError);
        } else {
          categoryMap[category.name] = newCategory.id;
          console.log(`Created category: ${category.name}`);
        }
      } else {
        categoryMap[category.name] = existingCategory.id;
        console.log(`Category already exists: ${category.name}`);
      }
    }

    // Now create products
    for (const product of sampleProducts) {
      console.log(`Creating product: ${product.name}`);

      // Create the product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          category_id: categoryMap[product.category],
          stock: product.stock
        })
        .select()
        .single();

      if (productError) {
        console.error('Error creating product:', productError);
        continue;
      }

      console.log(`Created product: ${newProduct.id}`);

      // Create translations
      for (const translation of product.translations) {
        const { error: translationError } = await supabase
          .from('product_translations')
          .insert({
            product_id: newProduct.id,
            language: translation.language,
            name: translation.name,
            description: translation.description
          });

        if (translationError) {
          console.error('Error creating translation:', translationError);
        } else {
          console.log(`Created translation for ${translation.language}: ${translation.name}`);
        }
      }
    }

    console.log('Product seeding completed!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

// Run the seeding function
seedProducts();
