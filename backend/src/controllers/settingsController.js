const Settings = require("../models/Settings");

// @desc    Get global settings
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      // Create defaults if not exists
      settings = await Settings.create({
        paymentMethods: [
          { name: "Cash", active: true },
          { name: "Credit/Debit Card", active: true },
          { name: "eSewa", active: true },
          { name: "Khalti", active: true },
          { name: "FonePay", active: false },
          { name: "General QR", active: true },
        ],
        systemPreferences: [
          { title: "Push Notifications", desc: "Enable browser alerts for new orders", active: true },
          { title: "Automated Daily Backups", desc: "Securely backup database at 3:00 AM", active: true },
        ],
        taxSettings: { vat: 13, serviceCharge: 10, defaultDiscount: 0 },
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Server error fetching settings" });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    const { taxSettings, paymentMethods, systemPreferences } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    if (taxSettings) settings.taxSettings = taxSettings;
    if (paymentMethods) settings.paymentMethods = paymentMethods;
    if (systemPreferences) settings.systemPreferences = systemPreferences;

    const updatedSettings = await settings.save();
    
    // Broadcast to connected clients so Cashiers get instant tax/payment updates
    if (req.io) req.io.emit("settingsUpdated", updatedSettings);

    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error updating settings" });
  }
};
