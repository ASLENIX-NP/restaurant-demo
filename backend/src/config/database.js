const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // This looks for the MONGODB_URI variable in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `Connected to MongoDB successfully: ${conn.connection.host}`
    );
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exits the server if the database connection fails
  }
};

module.exports = connectDB;
