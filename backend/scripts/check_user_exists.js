const mongoose = require("mongoose");
const Admin = require("./src/models/Admin");
const User = require("./src/models/User");
require("dotenv").config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = "aawaj1660@gmail.com";
  let admin = await Admin.findOne({ email });
  let user = await User.findOne({ email });
  console.log("Admin exists:", !!admin);
  console.log("User exists:", !!user);
  process.exit();
}
check();
