require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./src/models/Admin");
const User = require("./src/models/User");

async function seed() {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, { dbName: "restaurant_db" });
        console.log("Connected to DB (restaurant_db)");

        const defaultUsers = [
            { username: "admin", password: "admin123", role: "Admin", name: "System Admin" },
            { username: "staff", password: "staff123", role: "Staff", name: "Head Staff" },
            { username: "chef", password: "chef123", role: "Chef", name: "Head Chef" },
            { username: "cashier", password: "cashier123", role: "Cashier", name: "Main Cashier" }
        ];

        for (const u of defaultUsers) {
            
            if (u.role === "Admin") {
                const existing = await Admin.findOne({ username: u.username });
                if (!existing) {
                    await Admin.create({ ...u, email: `${u.username}@restaurant.com` });
                    console.log(`Created default Admin: ${u.username} / ${u.password}`);
                } else {
                    existing.password = u.password;
                    await existing.save();
                    console.log(`Updated Admin password: ${u.username} / ${u.password}`);
                }
            } else {
                const existing = await User.findOne({ username: u.username });
                if (!existing) {
                    await User.create({ ...u, status: "Active", email: `${u.username}@restaurant.com` });
                    console.log(`Created default User: ${u.username} / ${u.password}`);
                } else {
                    existing.password = u.password;
                    existing.status = "Active";
                    existing.role = u.role;
                    await existing.save();
                    console.log(`Updated User password/status: ${u.username} / ${u.password}`);
                }
            }
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

seed();
