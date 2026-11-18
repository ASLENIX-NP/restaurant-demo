const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Table = require("../src/models/Table");
const Category = require("../src/models/category");
const MenuItem = require("../src/models/MenuItem");

const demoCategories = [
  { name: "Burgers & Sandwiches", description: "Gourmet beef & chicken burgers served on artisanal brioche buns" },
  { name: "Pizzas", description: "Hand-stretched stone oven pizzas with premium toppings and melted cheeses" },
  { name: "Mains & Pasta", description: "Chef's specialty steaks, seafood, pasta, and wok dishes" },
  { name: "Appetizers & Sides", description: "Crispy wings, artisanal dumplings, tacos, and loaded golden fries" },
  { name: "Salads & Bowls", description: "Crisp wholesome greens, nutrient-dense bowls, and fresh garden toppings" },
  { name: "Desserts", description: "Decadent cakes, creamy cheesecakes, and sweet artisanal treats" },
  { name: "Beverages", description: "Specialty coffees, fresh iced mojitos, and refreshing craft mocktails" },
];

const demoTables = [
  { name: "Table 1", seats: 2, status: "Available", currentCustomer: "No Customer", reservationTime: null },
  { name: "Table 2", seats: 4, status: "Occupied", currentCustomer: "Rohan Shrestha", reservationTime: null },
  { name: "Table 3", seats: 4, status: "Available", currentCustomer: "No Customer", reservationTime: null },
  { name: "Table 4", seats: 6, status: "Reserved", currentCustomer: "Pooja Sharma", reservationTime: "18:30" },
  { name: "Table 5", seats: 4, status: "Cleaning", currentCustomer: "No Customer", reservationTime: null },
  { name: "Table 6", seats: 2, status: "Available", currentCustomer: "No Customer", reservationTime: null },
  { name: "Table 7", seats: 8, status: "Available", currentCustomer: "No Customer", reservationTime: null },
  { name: "VIP Lounge 1", seats: 6, status: "Available", currentCustomer: "No Customer", reservationTime: null },
];

const demoMenuItems = [
  // 1. Burgers & Sandwiches
  {
    name: "Classic Double Smash Cheeseburger",
    description: "Double beef smash patties, melted cheddar, pickles, crisp lettuce, tomato, and secret house sauce on a toasted sesame brioche.",
    price: 280,
    category: "Burgers & Sandwiches",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Gourmet Angus Burger with Fries",
    description: "Flame-grilled thick Angus beef patty, fresh red onion, tomato, cheddar, and garlic aioli, served with crisp steak fries.",
    price: 340,
    category: "Burgers & Sandwiches",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80",
  },

  // 2. Pizzas
  {
    name: "Wood-Fired Margherita Pizza",
    description: "Traditional Neapolitan crust topped with San Marzano tomato sauce, fresh mozzarella, extra virgin olive oil, and rosemary.",
    price: 420,
    category: "Pizzas",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Artisan Pepperoni & Salami Pizza",
    description: "Loaded with sliced pepperoni, smoked salami, crumbled Italian sausage, mozzarella cheese, and crushed red pepper.",
    price: 480,
    category: "Pizzas",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
  },

  // 3. Mains & Pasta
  {
    name: "Smoky BBQ Ribs Platter",
    description: "Slow-smoked tender pork ribs glazed in smoky barbecue sauce, served with loaded fries, pickles, and dipping sauce.",
    price: 650,
    category: "Mains & Pasta",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Pan-Seared Atlantic Salmon",
    description: "Crispy skin Atlantic salmon fillet served over garlic sautéed baby spinach with fresh diced tomato relish and balsamic reduction.",
    price: 580,
    category: "Mains & Pasta",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Penne Arrabbiata Pasta",
    description: "Al dente penne pasta tossed in a spicy garlic and herb tomato sauce, topped with aged grated parmesan cheese.",
    price: 350,
    category: "Mains & Pasta",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Wok-Fried Special Chowmein",
    description: "Stir-fried noodles with bell peppers, julienne carrots, cabbage, and aromatics tossed in savory dark soy and sesame sauce.",
    price: 220,
    category: "Mains & Pasta",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
  },

  // 4. Appetizers & Sides
  {
    name: "Spicy Buffalo Chicken Wings",
    description: "Crispy fried chicken wings tossed in tangy cayenne pepper buffalo sauce, served with buttermilk ranch and celery.",
    price: 290,
    category: "Appetizers & Sides",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Steamed Artisanal Dumplings",
    description: "Tender handmade dumplings filled with minced seasoned filling, garnished with fresh cilantro, spring onions, and roasted sesame.",
    price: 220,
    category: "Appetizers & Sides",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Crispy Avocado Street Tacos",
    description: "Soft warm corn tortillas stuffed with spiced chickpeas, roasted vegetables, fresh avocado slices, cilantro, and fresh lime.",
    price: 260,
    category: "Appetizers & Sides",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Golden Crispy French Fries",
    description: "Twice-cooked seasoned french fries dusted with sea salt and paprika, served hot and extra crispy.",
    price: 150,
    category: "Appetizers & Sides",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80",
  },

  // 5. Salads & Bowls
  {
    name: "Rainbow Mediterranean Salad Bowl",
    description: "Fresh baby spinach, sliced avocado, cherry tomatoes, broccoli florets, purple cabbage, radishes, and citrus vinaigrette.",
    price: 240,
    category: "Salads & Bowls",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Grilled Tofu Buddha Bowl",
    description: "Marinated pan-grilled tofu cubes, steamed edamame, sweet corn, cherry tomatoes, red cabbage, and hard-boiled egg.",
    price: 260,
    category: "Salads & Bowls",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
  },

  // 6. Desserts
  {
    name: "Double Chocolate Fudge Cake",
    description: "Decadent dark chocolate sponge layered with rich chocolate fudge frosting and finished with chocolate ganache drip.",
    price: 210,
    category: "Desserts",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Blueberry Glazed Cheesecake",
    description: "Silky New York baked cheesecake slice topped with sweet wild blueberry compote on a buttery graham crust.",
    price: 250,
    category: "Desserts",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
  },

  // 7. Beverages
  {
    name: "Fresh Mint Lime Mojito",
    description: "Refreshing muddled fresh garden mint, tart lime slices, organic cane syrup, and bubbly soda over crushed crystal ice.",
    price: 160,
    category: "Beverages",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Artisan Hot Cappuccino",
    description: "Freshly pulled double shot of espresso topped with silky textured milk and delicate barista latte art.",
    price: 140,
    category: "Beverages",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Signature Handcrafted Mocktails",
    description: "Trio of seasonal tropical fruit mocktails: passionfruit citrus, classic mint lime, and dragonfruit berry fizz.",
    price: 190,
    category: "Beverages",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
  },
];

const oldDemoItemNames = [
  "Special Matka Chiya",
  "Masala Milk Tea",
  "Fresh Sweet Lassi",
  "Steamed Chicken Momo",
  "Kothey Veg Momo",
  "Jhol Momo (Special)",
  "Chicken Chowmein",
  "Vegetable Hakka Chowmein",
  "Newari Khaja Set",
  "Aloo Paratha with Dahi",
  "Samosa Chaat",
  "Sel Roti with Aloo Dum",
  "Char-Grilled Chicken Sekuwa",
  "Masala Omelette & Toast",
];

const oldDemoCategoryNames = [
  "Tea & Beverages",
  "Momo",
  "Chowmein & Noodles",
  "Tiffin & Snacks",
  "Khaja Sets",
  "Breakfast",
];

async function seedDemoData() {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGO_URI ? "URI provided" : "No URI");
    await mongoose.connect(process.env.MONGO_URI, { dbName: "restaurant_db" });
    console.log("Connected to MongoDB (restaurant_db)");

    // 0. Remove old mismatched demo items & categories
    console.log("Cleaning up old mismatched demo items and categories...");
    const deletedItems = await MenuItem.deleteMany({ name: { $in: oldDemoItemNames } });
    console.log(`Removed ${deletedItems.deletedCount} old demo menu items.`);
    const deletedCats = await Category.deleteMany({ name: { $in: oldDemoCategoryNames } });
    console.log(`Removed ${deletedCats.deletedCount} old demo categories.`);

    // 1. Categories
    console.log("Seeding new categories...");
    for (const cat of demoCategories) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        cat,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoCategories.length} categories seeded/updated.`);

    // 2. Tables
    console.log("Seeding tables...");
    for (const tbl of demoTables) {
      await Table.findOneAndUpdate(
        { name: tbl.name },
        tbl,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoTables.length} tables seeded/updated.`);

    // 3. Menu Items
    console.log("Seeding verified menu items...");
    for (const item of demoMenuItems) {
      await MenuItem.findOneAndUpdate(
        { name: item.name },
        item,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoMenuItems.length} menu items seeded/updated.`);

    console.log("\n🎉 All demo data successfully populated!");
  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  }
}

seedDemoData();
