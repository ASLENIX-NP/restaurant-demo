const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET || 'fallback_secret_key', // Ensure there's a fallback if not set
      { expiresIn: "12h" }
    );

    // Send response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// User Registration (useful for initial setup or Admin to create users)
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate inputs
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Normalize and validate role if provided
    let normalizedRole = "Staff";
    if (role) {
      // Capitalize first letter, lowercase the rest (e.g., "chef" -> "Chef")
      normalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      
      const validRoles = ["Admin", "Chef", "Cashier", "Staff"];
      if (!validRoles.includes(normalizedRole)) {
        return res.status(400).json({ message: "Invalid role specified" });
      }
    }

    // Create new user
    const user = new User({
      username,
      password, // Password hashing is handled by the pre-save hook in User model
      role: normalizedRole
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
