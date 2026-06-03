require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database.js"); // Import the connection function
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);

// Root Route to show on the webpage
app.get("/", (req, res) => {
  res.send("<h1>Backend is running! </h1>");
});

// Basic Health Check Route (API specific)
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Restaurant Backend API is healthy!" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});

module.exports = app;