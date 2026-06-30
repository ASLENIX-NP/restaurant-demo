const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { loginLimiter } = require("../middleware/rateLimiter");
const { registerSchema, loginSchema } = require("../validators/authValidator");

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", loginLimiter, validate(loginSchema), authController.login);

// @route   POST /api/auth/verify-2fa
// @desc    Verify 2FA OTP after login
// @access  Public
router.post("/verify-2fa", loginLimiter, authController.verify2FA);

// @route   POST /api/auth/register
// @desc    Register a new user (Pending approval)
// @access  Public
router.post("/register", validate(registerSchema), authController.register);

// @route   POST /api/auth/forgot-password
// @desc    Generate password reset token
// @access  Public
router.post("/forgot-password", authController.forgotPassword);

// @route   POST /api/auth/verify-registration-otp
// @desc    Verify email OTP for a new registration
// @access  Public
router.post("/verify-registration-otp", authController.verifyRegistrationOtp);

// @route   POST /api/auth/reset-password
// @desc    Reset password using token
// @access  Public
router.post("/reset-password", authController.resetPassword);

// @route   POST /api/auth/users
// @desc    Add a new user (Admin)
// @access  Private (Admin only)
router.post("/users", protect, authorize("Admin"), validate(registerSchema), authController.addUser);

// @route   GET /api/auth/users
// @desc    Get all users
// @access  Private
router.get("/users", protect, authorize("Admin"), authController.getUsers);

// @route   PUT /api/auth/users/:id/status
// @desc    Update user status (Approve or Deactivate)
// @access  Private (Admin only)
router.put("/users/:id/status", protect, authorize("Admin"), authController.updateUserStatus);

// @route   PUT /api/auth/users/:id
// @desc    Update user details (Admin editing employee)
// @access  Private (Admin only)
router.put("/users/:id", protect, authorize("Admin"), authController.updateUser);

// @route   DELETE /api/auth/users/:id
// @desc    Delete a user permanently
// @access  Private (Admin only)
router.delete("/users/:id", protect, authorize("Admin"), authController.deleteUser);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private (Any logged-in user)
router.get("/profile", protect, authController.getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile and password
// @access  Private (Any logged-in user)
router.put("/profile", protect, authController.updateProfile);

// @route   PUT /api/auth/2fa/toggle
// @desc    Toggle 2FA for current user
// @access  Private (Any logged-in user)
router.put("/2fa/toggle", protect, authController.toggle2FA);

// --- TEST ROUTES FOR MIDDLEWARE ---

// @route   GET /api/auth/test
// @desc    Test basic token protection
// @access  Private (Any logged-in user)
router.get("/test", protect, (req, res) => {
  res.status(200).json({
    message: "Success! You have a valid token.",
    user: req.user,
  });
});

// @route   GET /api/auth/admin-only
// @desc    Test role-based authorization
// @access  Private (Admin only)
router.get("/admin-only", protect, authorize("Admin"), (req, res) => {
  res.status(200).json({
    message: "Success! Welcome Admin, you have special access.",
    user: req.user,
  });
});

module.exports = router;
