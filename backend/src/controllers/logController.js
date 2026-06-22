const Log = require("../models/Log");

/**
 * @desc    Create a new log entry. This is an internal helper function.
 * @param   {object} logData - The data for the log entry.
 */
exports.createLog = async (logData) => {
  try {
    const log = new Log(logData);
    await log.save();
  } catch (error) {
    console.error("Error creating log:", error);
  }
};

// @desc    Get all logs
// @route   GET /api/logs
// @access  Private (Admin)
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json(logs);
  } catch (error) {
    console.error("Get logs error:", error);
    res.status(500).json({ message: "Server error fetching logs" });
  }
};