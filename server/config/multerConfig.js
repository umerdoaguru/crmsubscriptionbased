const multer = require('multer');
const path = require('path');

// Configure disk storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder for saving files with an absolute path
    cb(null, path.resolve(__dirname, '../Assets'));
  },
  filename: function (req, file, cb) {
    // Generate a unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Set file upload limits and storage config
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  }
});

module.exports = upload;
