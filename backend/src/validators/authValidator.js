const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  }),
  name: Joi.string().max(50).optional().allow(""),
  email: Joi.string().email().optional().allow(""),
  phone: Joi.string().max(20).optional().allow(""),
  role: Joi.string().valid("Admin", "Manager", "Chef", "Waiter", "Cashier", "Staff").default("Staff"),
  shift: Joi.string().valid("Morning", "Day", "Evening", "Night").optional().allow(""),
  salary: Joi.string().optional().allow(""),
  image: Joi.string().uri().optional().allow(""),
  status: Joi.string().valid("Active", "Inactive", "Pending").default("Pending"),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
