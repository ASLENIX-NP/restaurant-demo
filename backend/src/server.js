require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const http = require("http");
const { Server } = require("socket.io");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now (can restrict to frontend URL later)
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Allows the server to accept JSON data in request bodies

// Attach Socket.io to the request object so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
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

// Socket.io Connection Logic
io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
