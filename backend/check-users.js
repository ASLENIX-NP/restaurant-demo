require("dotenv").config();
const connectDB = require("./src/config/database");
const User = require("./src/models/User");

const run = async () => {
  await connectDB();
  const users = await User.find({});
  console.log("Users in DB:", users);
  process.exit(0);
};
run();
