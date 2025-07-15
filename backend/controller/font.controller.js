const fs = require("fs");
const path = require("path");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utilities/common");

const UPLOADS_DIR = path.join(
  __dirname,
  "..",
  process.env.UPLOADS_DIR || "uploads"
);
const DATABASE_FILE = path.join(
  __dirname,
  "..",
  "database",
  process.env.DATABASE_FILE || "database.json"
);

const uploadFont = (req, res) => {
  console.log("req.file", req.file);
  console.log("req.fileValidationError", req.fileValidationError);
  if (req.fileValidationError) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send({ success: false, message: req.fileValidationError });
  }
  if (!req.file) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(failure("No file uploaded or invalid file type"));
  }

  let db;
  try {
    const dbContent = fs.readFileSync(DATABASE_FILE, "utf-8") || "{}";
    db = JSON.parse(dbContent);
  } catch (err) {
    db = { fonts: [] };
  }

  // Prevent duplicate entries
  if (!db.fonts.some((f) => f.name === req.file.originalname)) {
    db.fonts.push({
      name: req.file.originalname,
      path: `/uploads/${req.file.originalname}`,
    });
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(db, null, 2));
  }

  return res
    .status(HTTP_STATUS.OK)
    .send(
      success("File uploaded successfully", { name: req.file.originalname })
    );
};

const getFonts = (req, res) => {
  try {
    const dbContent = fs.readFileSync(DATABASE_FILE, "utf-8");
    const db = JSON.parse(dbContent);
    const fonts = db.fonts || [];
    if (fonts.length === 0) {
      return res
        .status(HTTP_STATUS.OK)
        .send(success("No fonts found in the database.", []));
    }
    return res
      .status(HTTP_STATUS.OK)
      .send(success("Fonts fetched successfully", fonts));
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR || 500)
      .send(failure("Failed to fetch fonts.", err.message));
  }
};

module.exports = { getFonts, uploadFont };
