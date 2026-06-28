require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");

// Setup rate limiter: maximum of 100 requests per 15 minutes (increased for dev)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (raised from 100)
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Secure CORS origin
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
const helmet = require("helmet");
app.use(helmet());
app.use(cors()); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Allows the server to accept JSON data in request bodies

// Attach Socket.io to the request object so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
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
