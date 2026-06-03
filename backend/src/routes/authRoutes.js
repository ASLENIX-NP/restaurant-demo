const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", authController.login);

// @route   POST /api/auth/register
// @desc    Register a new user (Restricted to Admin)
// @access  Private
router.post("/register", protect, authorize("Admin"), authController.register);

// @route   GET /api/auth/users
// @desc    Get all users
// @access  Private
router.get("/users", protect, authorize("Admin"), authController.getUsers);

// --- TEST ROUTES FOR MIDDLEWARE ---

// @route   GET /api/auth/test
// @desc    Test basic token protection
// @access  Private (Any logged-in user)
router.get("/test", protect, (req, res) => {
  res.status(200).json({ 
    message: "Success! You have a valid token.", 
    user: req.user 
  });
});

// @route   GET /api/auth/admin-only
// @desc    Test role-based authorization
// @access  Private (Admin only)
router.get("/admin-only", protect, authorize("Admin"), (req, res) => {
  res.status(200).json({ 
    message: "Success! Welcome Admin, you have special access.",
    user: req.user
  });
});

module.exports = router;
