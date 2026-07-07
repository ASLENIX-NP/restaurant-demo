require("dotenv").config();
require("node:dns").setDefaultResultOrder("ipv4first"); // Force IPv4 for all outbound requests (fixes Render IPv6 issues with Resend API)
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const http = require("http");
const { Server } = require("socket.io");
const { apiLimiter } = require("./middleware/rateLimiter");
const path = require("path");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:4173",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman) or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

// Connect to MongoDB
connectDB();

// Middleware
app.set('trust proxy', 1); // Trust first proxy (Render load balancer) to get real client IPs for rate limiting
const helmet = require("helmet");
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows images to be accessed cross-origin
}));
app.use(cors(corsOptions)); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Allows the server to accept JSON data in request bodies



// Attach Socket.io to the request object so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api", apiLimiter); // Apply general API limiter to all API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/tables", require("./routes/tableRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/logs", require("./routes/logRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use("/api/shifts", require("./routes/shiftRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

// Basic Health Check Route to verify it's working
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ message: "Restaurant Backend API is healthy and running!" });
});

// Root Route
app.get("/", (req, res) => {
  res.send("<h1>Restaurant Backend is Running! 🚀</h1>");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});

// Socket.io Connection Logic
io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
});

module.exports = { app, server, io };
