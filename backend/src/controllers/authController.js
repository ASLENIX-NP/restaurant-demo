const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user (Status defaults to Pending)
exports.register = async (req, res) => {
  try {
    const { username, password, confirmPassword, role, name, email, phone } =
      req.body;

    if (
      !username ||
      !password ||
      !confirmPassword ||
      !name ||
      !email ||
      !phone
    ) {
      return res.status(400).json({
        message:
          "All fields (username, password, confirm password, full name, email, phone) are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const formattedRole = role
      ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
      : "Staff";

    const existingUser = await User.findOne({ username });
    const existingAdmin = await Admin.findOne({ username });
    if (existingUser || existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }

    let user;
    if (formattedRole === "Admin") {
      user = new Admin({
        username,
        password,
        role: "Admin",
        name,
        email,
        phone,
        status: "Active", // Admins usually bypass approval
      });
    } else {
      user = new User({
        username,
        password,
        role: formattedRole,
        name,
        email,
        phone,
        status: "Pending", // Explicitly pending for Admin approval
      });
    }

    await user.save();

    // 📢 Broadcast to all listening admins that a new user needs approval
    if (formattedRole !== "Admin" && req.io) {
      req.io.emit("newRegistration", {
        message: `New user '${user.username}' is awaiting approval.`,
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          role: user.role,
          status: user.status,
        },
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please wait for an Admin to approve your account.",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check Admin collection first, then User collection
    let user = await Admin.findOne({ username });
    if (!user) {
      user = await User.findOne({ username });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Enforce Approval System
    if (user.status === "Pending")
      return res
        .status(403)
        .json({ message: "Your account is pending Admin approval." });
    if (user.status === "Inactive")
      return res
        .status(403)
        .json({ message: "Your account has been deactivated." });

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "12h" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get all users (For Admin Dashboard)
exports.getUsers = async (req, res) => {
  try {
    // Since Admins are now in the Admin collection, User.find() automatically only gets employees!
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// Update User Status (For Admin to Approve/Deactivate Users)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Ensure they only pass valid statuses
    const validStatuses = ["Active", "Inactive", "Pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.status = status;
    await user.save();

    // 📢 Broadcast that a user's status has changed (e.g., from Pending to Active)
    if (req.io) {
      req.io.emit("userStatusUpdated", {
        _id: user._id,
        status: user.status,
      });
    }

    res.status(200).json({
      success: true,
      message: `User status successfully updated to ${status}`,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error updating user status" });
  }
};

// Get user profile (Self)
exports.getProfile = async (req, res) => {
  try {
    let user = await Admin.findById(req.user.userId).select("-password");
    if (!user) {
      user = await User.findById(req.user.userId).select("-password");
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// Update user profile (Self)
exports.updateProfile = async (req, res) => {
  try {
    let user = await Admin.findById(req.user.userId);
    if (!user) {
      user = await User.findById(req.user.userId);
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, name, email, phone, currentPassword, newPassword } =
      req.body;

    // If the user is trying to change their password, verify the old one first
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required to set a new password.",
        });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password." });
      }
      user.password = newPassword; // The pre-save hook will automatically hash this!
    }

    // Update other details if provided
    if (username) user.username = username;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Username is already taken by another user." });
    }
    res.status(500).json({ message: "Server error updating profile." });
  }
};

// @desc    Delete a user by ID
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Optional: Prevent an admin from deleting their own account
    if (user._id.toString() === req.user.userId) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    }

    await user.deleteOne();

    // 📢 Broadcast that a user has been deleted to update UIs in real-time
    if (req.io) req.io.emit("userDeleted", { _id: req.params.id });

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting user" });
  }
};
