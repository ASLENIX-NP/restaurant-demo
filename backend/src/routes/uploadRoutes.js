const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const { GridFSBucket, ObjectId } = require("mongodb");
const path = require("path");
const ImageKit = require("imagekit");

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "dummy_public_key",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dummy",
});

// Set up Multer using memory storage
const storage = multer.memoryStorage();

// Filter to accept only images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp|gif|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only! (JPEG, PNG, WEBP, GIF, SVG)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

// @desc    Upload an image directly to ImageKit
// @route   POST /api/upload
// @access  Private (Admin/Cashier)
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  try {
    const uploadType = req.body.type || "menu"; // "menu" or "profile"
    let folderPath = "/restaurant-menu";
    let prefix = "menu-image-";

    if (uploadType === "profile") {
      folderPath = "/restaurant-profiles";
      prefix = "profile-image-";
    }

    const filename = `${prefix}${Date.now()}${path.extname(req.file.originalname)}`;
    
    // Check if credentials are set
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
       return res.status(500).json({ message: "ImageKit credentials are not configured in the .env file." });
    }

    const response = await imagekit.upload({
      file: req.file.buffer, // Pass buffer directly to ImageKit
      fileName: filename,
      folder: folderPath, // Organizes files in ImageKit
    });

    res.status(200).json({
      message: "Image uploaded successfully to ImageKit",
      url: response.url,
      filename: response.name,
      fileId: response.fileId
    });
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    res.status(500).json({ message: "Failed to upload image to ImageKit", error: error.message });
  }
});

// @desc    Retrieve an image from MongoDB GridFS (Legacy for old images)
// @route   GET /api/upload/image/:id
// @access  Public
router.get("/image/:id", async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "images",
    });

    const fileId = new ObjectId(req.params.id);

    // Check if file exists
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Set correct content type headers
    res.set("Content-Type", files[0].contentType);

    // Stream the file back to the browser
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (error) {
    res.status(404).json({ message: "Invalid image ID or not found" });
  }
});

module.exports = router;
