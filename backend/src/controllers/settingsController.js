const Settings = require("../models/Settings");
const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");
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

// @desc    Download full database backup as JSON
// @route   GET /api/settings/backup
// @access  Private/Admin
exports.backupDatabase = async (req, res) => {
  try {
    const backupData = {};
    const modelNames = mongoose.modelNames();
    for (const name of modelNames) {
       const Model = mongoose.model(name);
       backupData[name] = await Model.find({});
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=restaurant_backup.json');
    res.status(200).send(JSON.stringify(backupData));
  } catch (error) {
    console.error("Error backing up database:", error);
    res.status(500).json({ message: "Server error during backup" });
  }
};

// @desc    Upload JSON file to fully restore database
// @route   POST /api/settings/restore
// @access  Private/Admin
exports.restoreDatabase = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const backupData = JSON.parse(req.file.buffer.toString());
    
    // Drop all existing data for the keys in backupData, then insert
    for (const name of Object.keys(backupData)) {
       if (mongoose.modelNames().includes(name)) {
          const Model = mongoose.model(name);
          await Model.deleteMany({}); // Clear existing
          if (backupData[name] && backupData[name].length > 0) {
             await Model.insertMany(backupData[name]); // Restore data
          }
       }
    }
    res.status(200).json({ message: "Database restored successfully" });
  } catch (error) {
    console.error("Error restoring database:", error);
    res.status(500).json({ message: "Server error during restore. Invalid format or DB error." });
  }
};

// @desc    Export menu items to CSV
// @route   GET /api/settings/export-csv
// @access  Private/Admin
exports.exportCSV = async (req, res) => {
  try {
    const items = await MenuItem.find({});
    if (!items.length) {
      return res.status(400).json({ message: "No menu items to export" });
    }
    
    const headers = ["name", "description", "price", "category", "isAvailable", "image"];
    const rows = items.map(item => {
       return [
          `"${(item.name || "").replace(/"/g, '""')}"`,
          `"${(item.description || "").replace(/"/g, '""')}"`,
          item.price || 0,
          `"${(item.category || "").replace(/"/g, '""')}"`,
          item.isAvailable !== false,
          `"${(item.image || "").replace(/"/g, '""')}"`
       ].join(",");
    });
    
    const csvContent = headers.join(",") + "\n" + rows.join("\n");
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=menu_items.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ message: "Server error exporting CSV" });
  }
};

// Helper for basic CSV row parsing respecting quotes
function parseCSVRow(row) {
    let result = [];
    let insideQuote = false;
    let currentVal = '';
    for (let i = 0; i < row.length; i++) {
        let char = row[i];
        if (char === '"') {
            insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
            result.push(currentVal.trim());
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    result.push(currentVal.trim());
    return result;
}

// @desc    Upload CSV file to bulk import menu items
// @route   POST /api/settings/import-csv
// @access  Private/Admin
exports.importCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const csvString = req.file.buffer.toString();
    const rows = csvString.split(/\r?\n/).filter(row => row.trim());
    
    if (rows.length < 2) return res.status(400).json({ message: "CSV file is empty or missing headers" });
    
    const headers = parseCSVRow(rows[0]).map(h => h.toLowerCase());
    const newItems = [];
    
    for (let i = 1; i < rows.length; i++) {
       const values = parseCSVRow(rows[i]);
       const itemData = {};
       
       headers.forEach((header, index) => {
           let val = values[index] !== undefined ? values[index] : "";
           if (header === "price") val = parseFloat(val) || 0;
           if (header === "isavailable") val = val.toLowerCase() !== 'false';
           itemData[header] = val;
       });
       
       // Only add if name and price exist
       if (itemData.name && itemData.price > 0) {
           newItems.push({
               name: itemData.name,
               description: itemData.description || "",
               price: itemData.price,
               category: itemData.category || "Uncategorized",
               isAvailable: itemData.isavailable !== undefined ? itemData.isavailable : true,
               image: itemData.image || ""
           });
       }
    }
    
    if (newItems.length > 0) {
       await MenuItem.insertMany(newItems);
    }
    
    res.status(200).json({ message: `Successfully imported ${newItems.length} menu items` });
  } catch (error) {
    console.error("Error importing CSV:", error);
    res.status(500).json({ message: "Server error importing CSV. Please check format." });
  }
};
