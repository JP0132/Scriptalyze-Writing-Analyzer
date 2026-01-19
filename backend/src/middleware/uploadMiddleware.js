const multer = require("multer");
const path = require("path");

// Configure storage (save to 'uploads/' folder temporarily)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save here
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  },
});

const uploadNew = multer({ storage });

module.exports = { upload, uploadNew };
