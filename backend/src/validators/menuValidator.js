const Joi = require("joi");

const menuItemSchema = Joi.object({
  name: Joi.string().required().max(100),
  description: Joi.string().optional().allow(""),
  price: Joi.number().min(0).required(),
  category: Joi.string().required().max(50),
  image: Joi.string().optional().allow(""),
  isAvailable: Joi.boolean().default(true),
  isSpecial: Joi.boolean().default(false),
  availability: Joi.boolean().default(true),
  ingredients: Joi.array().items(
    Joi.object({
      inventoryItem: Joi.string().optional().allow(null, ""),
      itemName: Joi.string().optional(),
      qty: Joi.number().default(1)
    })
  ).optional(),
});

module.exports = {
  menuItemSchema,
};
