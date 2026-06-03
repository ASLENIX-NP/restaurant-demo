require("dotenv").config();
const connectDB = require("./src/config/database");
const User = require("./src/models/User");
const bcrypt = require("bcryptjs");

const run = async () => {
  await connectDB();
  const user = await User.findOne({ username: 'admin' });
  if (user) {
    user.password = "admin123";
    await user.save();
    console.log("Admin password reset to 'admin123'");
  } else {
    console.log("Admin user not found");
  }
  process.exit(0);
};
run();
