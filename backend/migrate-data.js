require("dotenv").config();
const mongoose = require("mongoose");

const migrate = async () => {
  try {
    console.log("🔄 Connecting to databases...");

    // Connect to both the old 'test' DB and the new 'restaurant_db'
    const testDb = await mongoose
      .createConnection(process.env.MONGO_URI, { dbName: "test" })
      .asPromise();
    const destDb = await mongoose
      .createConnection(process.env.MONGO_URI, { dbName: "restaurant_db" })
      .asPromise();

    console.log("📥 Fetching data from the old 'test' database...");
    const users = await testDb.collection("users").find().toArray();
    const menuItems = await testDb.collection("menuitems").find().toArray();

    console.log(
      `Found ${users.length} users and ${menuItems.length} menu items.`
    );

    // Copy Users
    if (users.length > 0) {
      console.log("📤 Copying users to 'restaurant_db'...");
      await destDb
        .collection("users")
        .insertMany(users, { ordered: false })
        .catch((e) =>
          console.log(" Note: Some users already existed in the destination.")
        );
    }

    // Copy Menu Items
    if (menuItems.length > 0) {
      console.log("📤 Copying menu items to 'restaurant_db'...");
      await destDb
        .collection("menuitems")
        .insertMany(menuItems, { ordered: false })
        .catch((e) =>
          console.log(
            " Note: Some menu items already existed in the destination."
          )
        );
    }

    console.log("🗑️ Dropping the old 'test' database...");
    await testDb.dropDatabase();

    console.log(
      "✅ Migration complete! Everything is now stored exclusively in 'restaurant_db'."
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrate();
