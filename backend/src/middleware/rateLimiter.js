const rateLimit = require("express-rate-limit");

// General API Limiter (1000 requests per 15 mins)
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});

// Strict Login Limiter (5 requests per 15 mins)
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: { message: "Too many login attempts from this IP, please try again after 15 minutes. Brute force protection activated." }
});
