require("dotenv").config();
const connectDB = require("./src/db");
const User = require("./src/models/User");

const seedAdmin = async () => {
  await connectDB();

  try {
    let admin = await User.findOne({ username: "safal" });

    if (!admin) {
      admin = new User({
        username: "safal",
        password: "password123",
        role: "Admin",
        status: "Active",
      });
      await admin.save();
      console.log("✅ Admin user 'safal' created successfully!");
    } else {
      admin.password = "password123";
      admin.status = "Active";
      await admin.save();
      console.log("✅ Admin user 'safal' password updated successfully!");
    }
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
