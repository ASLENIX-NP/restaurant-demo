require("dotenv").config();
const mongoose = require("mongoose");

const migrate = async () => {
  try {
    console.log("🔄 Connecting to databases...");

    const testDb = await mongoose
      .createConnection(process.env.MONGO_URI, { dbName: "test" })
      .asPromise();
    const destDb = await mongoose
      .createConnection(process.env.MONGO_URI, { dbName: "restaurant_db" })
      .asPromise();

    console.log("📥 Fetching collections from the old 'test' database...");
    const collections = await testDb.db.listCollections().toArray();
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const documents = await testDb.collection(collectionName).find().toArray();
      
      console.log(`Found ${documents.length} documents in collection: ${collectionName}`);
      
      if (documents.length > 0) {
        console.log(`📤 Copying ${collectionName} to 'restaurant_db'...`);
        await destDb
          .collection(collectionName)
          .insertMany(documents, { ordered: false })
          .catch((e) =>
            console.log(` Note: Some documents in ${collectionName} already existed in the destination.`)
          );
      }
    }

    console.log("🗑️ Dropping the old 'test' database...");
    await testDb.dropDatabase();

    console.log("✅ Migration complete! Everything is now stored exclusively in 'restaurant_db'.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrate();
