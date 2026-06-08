require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Allows the server to accept JSON data in request bodies

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));

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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
