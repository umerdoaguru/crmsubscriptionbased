const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../Assets"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const generalUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/blog_image"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMime = "image/webp";
  const allowedExt = ".webp";
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype === allowedMime && ext === allowedExt) {
    cb(null, true);
  } else {
    cb(new Error("Only .webp images are allowed!"), false);
  }
};

const blogUpload = multer({
  storage: blogStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const registryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../registry_documents"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const registryFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const uploadRegistryDoc = multer({
  registryStorage,
  registryFileFilter,
}).single("registry_document_url");

module.exports = { generalUpload, blogUpload, uploadRegistryDoc };
