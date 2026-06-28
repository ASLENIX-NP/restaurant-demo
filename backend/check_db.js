const mongoose = require("mongoose");
const Admin = require("./src/models/Admin");
const User = require("./src/models/User");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost:27017/restaurant_db").then(async () => {
    console.log("Connected to DB");
    const admins = await Admin.find({});
    console.log("Admins:", admins.map(a => ({ username: a.username, role: a.role })));
    
    const users = await User.find({});
    console.log("Users:", users.map(u => ({ username: u.username, role: u.role, status: u.status })));
    
    // Create admin if not exists
    if (admins.length === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await Admin.create({
            username: "admin",
            password: hashedPassword,
            name: "System Admin",
            role: "Admin",
            email: "admin@aslenix.com"
        });
        console.log("Created default admin: admin / admin123");
    }
    
    mongoose.disconnect();
});
