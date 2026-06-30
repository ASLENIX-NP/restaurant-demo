const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Cashier", "Chef", "Staff", "Waiter"],
      default: "Staff",
    },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    shift: { type: String },
    salary: { type: String },
    image: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Pending",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    emailVerificationOtp: { type: String },
    emailVerificationExpires: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorOtp: { type: String },
    twoFactorExpires: { type: Date },
  },
  { timestamps: true }
);

// Pre-save hook to automatically hash passwords before saving them to MongoDB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
