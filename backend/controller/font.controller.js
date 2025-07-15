const fs = require("fs");
const path = require("path");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utilities/common");
const { v4: uuidv4 } = require("uuid");
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
      id: uuidv4(),
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

const deleteFont = (req, res) => {
  const fontId = req.params.id;

  if (!fontId) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(failure("Font ID required"));
  }

  let db;
  try {
    const dbContent = fs.readFileSync(DATABASE_FILE, "utf-8") || "{}";
    db = JSON.parse(dbContent);
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Failed to read database.", err.message));
  }

  const fontIndex = db.fonts.findIndex((f) => f.id === fontId);
  if (fontIndex === -1) {
    return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Font not found"));
  }

  // Remove font file from uploads directory
  const fontPath = path.join(UPLOADS_DIR, db.fonts[fontIndex].name);
  try {
    if (fs.existsSync(fontPath)) {
      fs.unlinkSync(fontPath);
    }
  } catch (err) {
    // If file deletion fails, continue to remove from db
    console.error("font deletion failed", err);
  }

  db.fonts.splice(fontIndex, 1);
  fs.writeFileSync(DATABASE_FILE, JSON.stringify(db, null, 2));

  return res.status(HTTP_STATUS.OK).send(success("Font deleted successfully"));
};

module.exports = { getFonts, uploadFont, deleteFont };
