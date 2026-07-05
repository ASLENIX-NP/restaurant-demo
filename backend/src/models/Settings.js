const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    // A singleton document usually has a fixed ID, but we can just query the first one.
    isSingleton: { type: Boolean, default: true, unique: true },

    taxSettings: {
      vat: { type: Number, default: 13 },
      serviceCharge: { type: Number, default: 10 },
      defaultDiscount: { type: Number, default: 0 },
    },

    paymentMethods: [
      {
        name: { type: String, required: true },
        active: { type: Boolean, default: true },
      },
    ],

    systemPreferences: [
      {
        title: { type: String, required: true },
        desc: { type: String },
        active: { type: Boolean, default: true },
      },
    ],
    
    restaurantInfo: {
      name: { type: String, default: "मिठ्ठो चिया & Tiffin घर" },
      branch: { type: String, default: "Main Branch" },
      email: { type: String, default: "" },
      phone: { type: String, default: "+977 9812345678" },
      pan: { type: String, default: "123456789" },
      website: { type: String, default: "www.restaurant.com" },
      address: { type: String, default: "Kathmandu, Nepal" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
