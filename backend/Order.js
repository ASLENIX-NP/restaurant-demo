const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    station: { type: String },
    notes: { type: String },
    delivered: { type: Boolean, default: false }
});

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true }, // e.g. #ORD-1234
    table: { type: String, required: true },
    server: { type: String },
    channel: { type: String },
    priority: { type: String, default: "Normal" },
    station: { type: String },
    notes: { type: String },
    status: {
        type: String,
        enum: ["Pending", "Cooking", "Ready", "Completed"],
        default: "Pending"
    },
    items: [orderItemSchema],
    subtotal: { type: Number },
    vat: { type: Number },
    total: { type: Number },
    time: { type: String },
    date: { type: String },
    elapsedMinutes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Order", orderSchema);