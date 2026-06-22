require("dotenv").config();
const connectDB = require("./src/db");
const Admin = require("./src/models/Admin");

const seedAdmin = async () => {
  await connectDB();

  try {
    let admin = await Admin.findOne({ username: "admin" });

    if (!admin) {
      admin = new Admin({
        username: "admin",
        name: "Admin User",
        password: "admin123",
        role: "Admin",
        status: "Active",
      });
      await admin.save();
      console.log("✅ Admin user created successfully!");
    } else {
      admin.password = "admin123";
      admin.status = "Active";
      await admin.save();
      console.log("✅ Admin user password updated successfully!");
    }
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
