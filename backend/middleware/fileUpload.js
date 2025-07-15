const multer = require("multer");
const path = require("path");

const configureFontUpload = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "font/ttf" ||
      file.originalname.toLowerCase().endsWith(".ttf")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .ttf font files are allowed!"));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).single("font");

  return upload;
};

module.exports = { configureFontUpload };
