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

getFonts = (req, res, sendJSON) => {
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

module.exports = { getFonts };
