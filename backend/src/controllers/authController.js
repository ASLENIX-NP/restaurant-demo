const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { createLog } = require("./logController");
const sendEmail = require("../utils/sendEmail");

// Register a new user (Status defaults to Pending)
exports.register = async (req, res) => {
  try {
    const { username, password, role, name, email, phone } = req.body;

    // Sanitize role to prevent arbitrary roles
    const allowedRoles = ["Staff", "Chef", "Waiter", "Cashier"];
    const requestedRole = role
      ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
      : "Staff";

    const formattedRole = allowedRoles.includes(requestedRole) ? requestedRole : "Staff";

    const existingUsername = await User.findOne({ username }) || await Admin.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username is already taken by another person." });

    if (email) {
      const existingEmail = await User.findOne({ email }) || await Admin.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: "Email is already registered to another account." });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone }) || await Admin.findOne({ phone });
      if (existingPhone) return res.status(400).json({ message: "Phone number is already in use by another person." });
    }

    // Force ALL public registrations into the User collection with 'Pending' status.
    // Admins MUST be created by other Admins through a secure internal endpoint or DB seed.
    const user = new User({
        username,
        password,
        role: formattedRole,
        name,
        email,
        phone,
        status: "Pending", // Explicitly pending for Admin approval
        isEmailVerified: false,
    });

    // Generate 6-digit OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationOtp = otp;
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send the OTP via email
    const message = `Welcome to मिठ्ठो चिया & Tiffin घर!\n\nYour registration OTP is: ${otp}\n\nPlease use this to verify your email. The code is valid for 10 minutes.\n\nThank you,\nThe Team`;
    try {
      await sendEmail({
        email: user.email,
        subject: "मिठ्ठो चिया & Tiffin घर Registration - Verify your email",
        message,
      });
    } catch (err) {
      console.error("Email could not be sent:", err);
      // We do not fail registration if email fails, but in production we might want to handle it better.
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful. An OTP has been sent to your email.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.username) return res.status(400).json({ message: "Username is already taken." });
      if (error.keyPattern?.email) return res.status(400).json({ message: "Email is already registered." });
      if (error.keyPattern?.phone) return res.status(400).json({ message: "Phone number is already in use." });
      return res.status(400).json({ message: "An account with these details already exists." });
    }
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// Verify Registration OTP
exports.verifyRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      emailVerificationOtp: otp,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // 📢 Broadcast to all listening admins that a new user needs approval
    if (user.role !== "Admin" && req.io) {
      req.io.emit("newRegistration", {
        message: `New user '${user.username}' has verified their email and is awaiting approval.`,
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          role: user.role,
          status: user.status,
          email: user.email,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully! Please wait for Admin approval.",
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server error verifying OTP" });
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
      // Log failed attempt for non-existent user
      createLog({
        user: username,
        role: "Unknown",
        action: "Failed Login",
        device: req.headers["user-agent"],
        ip: req.ip,
        status: "Failed",
      });
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log failed attempt for existing user with wrong password
      createLog({
        user: username,
        role: user.role,
        action: "Failed Login",
        device: req.headers["user-agent"],
        ip: req.ip,
        status: "Failed",
      });
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Enforce Approval System
    if (user.status === "Pending") {
      createLog({ user: username, role: user.role, action: "Login Denied (Pending)", device: req.headers["user-agent"], ip: req.ip, status: "Failed" });
      return res
        .status(403)
        .json({ message: "Your account is pending Admin approval." });
    }
    if (user.status === "Inactive") {
      createLog({ user: username, role: user.role, action: "Login Denied (Inactive)", device: req.headers["user-agent"], ip: req.ip, status: "Failed" });
      return res
        .status(403)
        .json({ message: "Your account has been deactivated." });
    }

    // 2FA Verification Step
    if (user.twoFactorEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.twoFactorOtp = otp;
      user.twoFactorExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      const message = `मिठ्ठो चिया & Tiffin घर Login Attempt\n\nYour 2-Factor Authentication code is: ${otp}\n\nPlease enter this code to complete your login. It is valid for 10 minutes.\n\nIf you did not request this, please change your password immediately.\n\nThank you,\nThe Team`;
      try {
        await sendEmail({
          email: user.email,
          subject: "मिठ्ठो चिया & Tiffin घर - Your 2FA Login Code",
          message,
        });
      } catch (err) {
        console.error("2FA Email could not be sent:", err);
      }

      return res.status(200).json({
        success: true,
        requires2FA: true,
        userId: user._id,
        message: "2FA code sent to your email."
      });
    }

    const expiresIn = (user.role === "Admin" || user.role === "Manager") ? "1h" : "12h";
    
    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn }
    );

    // Log successful login
    createLog({
      user: user.username,
      role: user.role,
      action: "Logged In",
      device: req.headers["user-agent"],
      ip: req.ip,
      status: "Success",
    });

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error?.message,
    });
  }
};

// Verify 2FA OTP and login
exports.verify2FA = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP are required" });
    }

    let user = await Admin.findById(userId);
    if (!user) {
      user = await User.findById(userId);
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.twoFactorOtp !== otp || user.twoFactorExpires < Date.now()) {
      createLog({
        user: user.username,
        role: user.role,
        action: "Failed 2FA Login",
        device: req.headers["user-agent"],
        ip: req.ip,
        status: "Failed",
      });
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear 2FA fields
    user.twoFactorOtp = undefined;
    user.twoFactorExpires = undefined;
    await user.save();

    const expiresIn = (user.role === "Admin" || user.role === "Manager") ? "1h" : "12h";
    
    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn }
    );

    // Log successful login
    createLog({
      user: user.username,
      role: user.role,
      action: "Logged In (2FA)",
      device: req.headers["user-agent"],
      ip: req.ip,
      status: "Success",
    });

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
        },
      });
  } catch (error) {
    console.error("2FA Verification Error:", error);
    res.status(500).json({ message: "Server error verifying 2FA" });
  }
};

// Add a new user (Admin directly adding an employee)
exports.addUser = async (req, res) => {
  try {
    const { username, password, role, name, email, phone, shift, salary, status, image } = req.body;

    const existingUsername = await User.findOne({ username }) || await Admin.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username is already taken by another person." });

    if (email) {
      const existingEmail = await User.findOne({ email }) || await Admin.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: "Email is already registered to another account." });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone }) || await Admin.findOne({ phone });
      if (existingPhone) return res.status(400).json({ message: "Phone number is already in use by another person." });
    }

    const user = new User({
        username,
        password,
        role,
        name,
        email,
        phone,
        shift,
        salary,
        status: status || "Active",
        image: image || "https://randomuser.me/api/portraits/men/1.jpg",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Employee added successfully.",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.username) return res.status(400).json({ message: "Username is already taken." });
      if (error.keyPattern?.email) return res.status(400).json({ message: "Email is already registered." });
      if (error.keyPattern?.phone) return res.status(400).json({ message: "Phone number is already in use." });
      return res.status(400).json({ message: "An account with these details already exists." });
    }
    console.error("Add user error:", error);
    res.status(500).json({
      message: "Server error adding employee",
      error: error.message,
    });
  }
};

// Get all users (For Admin Dashboard)
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 0, search = "", role = "", status = "" } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role && role !== "All") {
      query.role = role;
    }
    if (status && status !== "All") {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    let usersPromise = User.find(query).select("-password").lean();
    
    if (limitNum > 0) {
      usersPromise = usersPromise
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
    }

    const [users, total] = await Promise.all([
      usersPromise,
      User.countDocuments(query),
    ]);

    res.status(200).json({
      users,
      metadata: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 1,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// Update User Status (For Admin to Approve/Deactivate Users)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let user = await Admin.findById(id);
    if (!user) {
      user = await User.findById(id);
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();

    // 📢 Emit socket event if a user is approved
    if (status === "Active" && req.io) {
      req.io.emit("userApproved", {
        message: `User '${user.username}' has been approved and is now active.`,
        user: { _id: user._id, username: user.username, role: user.role },
      });
    }

    createLog({
      user: req.user.username,
      role: req.user.role,
      action: `Updated User Status: ${user.username} to ${status}`,
      device: req.headers["user-agent"],
      ip: req.ip,
      status: "Success",
    });

    res.status(200).json({ message: `User status updated to ${status}` });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error updating status" });
  }
};

// Update User details (For Admin to Edit Employees)
// @access Private (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, name, email, phone, role, salary, shift, image } = req.body;

    let user = await Admin.findById(id);
    if (!user) {
      user = await User.findById(id);
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    // Note: We intentionally DO NOT update the password here, 
    // as admins should not change employee passwords directly.
    if (username) user.username = username;
    if (name) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;
    if (salary !== undefined) user.salary = salary;
    if (shift !== undefined) user.shift = shift;
    if (image !== undefined) user.image = image;

    await user.save();

    createLog({
      user: req.user.username,
      role: req.user.role,
      action: `Updated User Details: ${user.username}`,
      device: req.headers["user-agent"],
      ip: req.ip,
      status: "Success",
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        salary: user.salary,
        shift: user.shift,
        image: user.image,
        status: user.status
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.username) return res.status(400).json({ message: "Username is already taken." });
      if (error.keyPattern?.email) return res.status(400).json({ message: "Email is already registered." });
      if (error.keyPattern?.phone) return res.status(400).json({ message: "Phone number is already in use." });
      return res.status(400).json({ message: "An account with these details already exists." });
    }
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error updating user" });
  }
};

// Get user profile (Self)
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// Update user profile (Self)
exports.updateProfile = async (req, res) => {
  try {
    let user = await Admin.findById(req.user._id);
    if (!user) {
      user = await User.findById(req.user._id);
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, name, email, phone, currentPassword, newPassword, image } =
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
    if (image !== undefined) user.image = image;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.username) return res.status(400).json({ message: "Username is already taken." });
      if (error.keyPattern?.email) return res.status(400).json({ message: "Email is already registered." });
      if (error.keyPattern?.phone) return res.status(400).json({ message: "Phone number is already in use." });
      return res.status(400).json({ message: "An account with these details already exists." });
    }
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error updating profile." });
  }
};

// @desc    Toggle 2FA for current user
// @route   PUT /api/auth/2fa/toggle
// @access  Private
exports.toggle2FA = async (req, res) => {
  try {
    let user = await Admin.findById(req.user._id);
    if (!user) {
      user = await User.findById(req.user._id);
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    user.twoFactorEnabled = !user.twoFactorEnabled;
    await user.save();

    createLog({
      user: req.user.username,
      role: req.user.role,
      action: `Toggled 2FA to ${user.twoFactorEnabled}`,
      device: req.headers["user-agent"],
      ip: req.ip,
      status: "Success",
    });

    res.status(200).json({
      success: true,
      message: `Two-Factor Authentication has been ${user.twoFactorEnabled ? 'enabled' : 'disabled'}.`,
      twoFactorEnabled: user.twoFactorEnabled
    });
  } catch (error) {
    console.error("Toggle 2FA error:", error);
    res.status(500).json({ message: "Server error toggling 2FA." });
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

    createLog({
      user: req.user.username,
      role: req.user.role,
      action: `Deleted User: ${user.username}`,
      device: req.headers["user-agent"],
      ip: req.ip,
      status: "Success",
    });

    // 📢 Broadcast that a user has been deleted to update UIs in real-time
    if (req.io) req.io.emit("userDeleted", { _id: req.params.id });

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting user" });
  }
};

// @desc    Forgot Password - Generate Token
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide an email address." });
    }

    let user = await Admin.findOne({ email });
    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      // Return a generic message so as not to leak registered emails
      return res.status(200).json({ 
        success: true, 
        message: "If an account exists with this email, a reset link will be generated.",
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB (reusing resetPasswordToken field)
    user.resetPasswordToken = otpCode;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes expiration

    await user.save({ validateBeforeSave: false });

    // In a real application, send this via Email.
    const message = `You are receiving this email because you (or someone else) requested a password reset for your मिठ्ठो चिया & Tiffin घर account.\n\nYour One-Time Password (OTP) is: ${otpCode}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;

    try {
      const previewUrl = await sendEmail({
        email: user.email,
        subject: "Password Reset Request - मिठ्ठो चिया & Tiffin घर",
        message,
      });

      let responseMessage = "An email with instructions to reset your password has been sent.";
      if (previewUrl) {
        responseMessage = `Email sent via test account. Click here to view it:\n\n${previewUrl}`;
      }

      res.status(200).json({
        success: true,
        message: responseMessage,
        previewUrl,
      });
    } catch (err) {
      console.error("Error sending email:", err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: "Email could not be sent. Please check if your Gmail App Password is correctly configured." });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error processing forgot password." });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required." });
    }

    let user = await Admin.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      user = await User.findOne({
        email,
        resetPasswordToken: otp,
        resetPasswordExpires: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been successfully reset. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error resetting password." });
  }
};
