const cron = require("node-cron");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { createLog } = require("../controllers/logController");

const startCronJobs = () => {
  // Run every day at 2:00 AM: '0 2 * * *'
  cron.schedule("0 2 * * *", async () => {
    try {
      console.log("Running scheduled daily database backup...");
      const backupData = {};
      const modelNames = mongoose.modelNames();
      
      for (const name of modelNames) {
        const Model = mongoose.model(name);
        backupData[name] = await Model.find({});
      }
      
      const backupsDir = path.join(__dirname, "../../backups");
      if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir, { recursive: true });
      }

      const dateStr = new Date().toISOString().split("T")[0];
      const filename = `restaurant_backup_${dateStr}.json`;
      const filepath = path.join(backupsDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));

      console.log(`Database backup saved successfully to ${filepath}`);
      
      createLog({
        user: "System Cron",
        role: "System",
        action: `Automated Daily Backup Created: ${filename}`,
        device: "Server",
        ip: "localhost",
        status: "Success",
      });
    } catch (error) {
      console.error("Failed to run scheduled backup:", error);
      createLog({
        user: "System Cron",
        role: "System",
        action: `Automated Daily Backup Failed`,
        device: "Server",
        ip: "localhost",
        status: "Failed",
      });
    }
  });
  
  console.log("✅ Cron jobs initialized.");
};

module.exports = startCronJobs;
