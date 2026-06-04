const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Configure WebSockets for real-time KDS updates
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Matches Vite's default port
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible to our routes
app.set("io", io);

// Database Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.log("❌ MongoDB Connection Error: ", err));

// Connect API Routes
const orderRoutes = require("./src/routes/orderRoutes");
const authRoutes = require("./src/routes/authRoutes");
const menuRoutes = require("./src/routes/menuRoutes");

app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);

// Basic Health Route
app.get("/", (req, res) => {
    res.send("Restaurant API is running...");
});

// Socket.io Connection Logic
io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));