const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Table = require("../src/models/Table");
const Category = require("../src/models/category");
const MenuItem = require("../src/models/MenuItem");

const demoCategories = [
  { name: "Tea & Beverages", description: "Hot specialty teas, cold beverages and traditional lassi" },
  { name: "Momo", description: "Authentic steamed, fried, and jhol dumplings" },
  { name: "Chowmein & Noodles", description: "Wok-fried noodles seasoned with Nepali spices" },
  { name: "Tiffin & Snacks", description: "Savory afternoon snacks, sekuwa, and chaat" },
  { name: "Khaja Sets", description: "Hearty traditional Nepali and Newari snack platters" },
  { name: "Breakfast", description: "Morning favorites, parathas, eggs and toast" },
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
  {
    name: "Special Matka Chiya",
    description: "Authentic slow-brewed spiced milk tea served in an earthen clay pot.",
    price: 60,
    category: "Tea & Beverages",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Masala Milk Tea",
    description: "Aromatic Nepali milk tea infused with cardamom, cinnamon, and ginger.",
    price: 40,
    category: "Tea & Beverages",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Fresh Sweet Lassi",
    description: "Rich and creamy churned yogurt drink topped with crushed pistachios.",
    price: 120,
    category: "Tea & Beverages",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Steamed Chicken Momo",
    description: "Juicy minced chicken dumplings seasoned with Himalayan spices, served with homemade tomato achar.",
    price: 180,
    category: "Momo",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Kothey Veg Momo",
    description: "Pan-fried vegetable dumplings with a crispy golden bottom and tender top.",
    price: 140,
    category: "Momo",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Jhol Momo (Special)",
    description: "Steamed dumplings submerged in a warm, tangy roasted sesame, tomato and soybean broth.",
    price: 210,
    category: "Momo",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Chicken Chowmein",
    description: "Wok-tossed noodles with tender shredded chicken, crisp cabbage, carrots, and spring onions.",
    price: 170,
    category: "Chowmein & Noodles",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Vegetable Hakka Chowmein",
    description: "Classic stir-fried noodles with bell peppers, green beans, cabbage, and savory soy glaze.",
    price: 130,
    category: "Chowmein & Noodles",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Newari Khaja Set",
    description: "Traditional sampler platter with beaten rice (baji), spiced choila, aloo tama, roasted soya beans, and spicy pickle.",
    price: 320,
    category: "Khaja Sets",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Aloo Paratha with Dahi",
    description: "Golden griddle-cooked flatbread stuffed with spiced mashed potatoes, served with fresh curd and pickle.",
    price: 150,
    category: "Breakfast",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Samosa Chaat",
    description: "Crushed crispy samosas layered with spiced chickpea gravy, sweet yoghurt, tamarind chutney, and crunchy sev.",
    price: 110,
    category: "Tiffin & Snacks",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sel Roti with Aloo Dum",
    description: "Traditional crispy sweet rice doughnut rings paired with fiery slow-cooked potato curry.",
    price: 130,
    category: "Tiffin & Snacks",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Char-Grilled Chicken Sekuwa",
    description: "Skewered char-grilled chicken marinated with Himalayan herbs, mustard oil, garlic, and chili.",
    price: 260,
    category: "Tiffin & Snacks",
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Masala Omelette & Toast",
    description: "Fluffy two-egg omelette folded with chopped onions, tomatoes, cilantro, and toast with butter.",
    price: 100,
    category: "Breakfast",
    isAvailable: true,
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
  },
];

async function seedDemoData() {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGO_URI ? "URI provided" : "No URI");
    await mongoose.connect(process.env.MONGO_URI, { dbName: "restaurant_db" });
    console.log("Connected to MongoDB (restaurant_db)");

    // 1. Categories
    console.log("Seeding categories...");
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
    console.log("Seeding menu items...");
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
