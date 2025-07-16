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

const createGroup = (req, res) => {
  try {
    let { name, fonts } = req.body;
    console.log("req.body", req.body);
    if (typeof fonts === "string") {
      try {
        fonts = JSON.parse(fonts);
      } catch {
        fonts = [fonts];
      }
    }
    if (!name || !Array.isArray(fonts) || fonts.length < 2) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Group name and at least two fonts are required"));
    }
    const db = JSON.parse(fs.readFileSync(DATABASE_FILE, "utf-8"));
    if (!db.groups) db.groups = [];
    if (db.groups.find((g) => g.name === name)) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .send(failure("Group name already exists"));
    }
    const allFontNames = db.fonts.map((f) => f.name);
    const invalidFonts = fonts.filter((f) => !allFontNames.includes(f));
    if (invalidFonts.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(
          HTTP_STATUS.BAD_REQUEST,
          failure(`Invalid font names: ${invalidFonts.join(", ")}`)
        );
    }
    // Check for duplicate font sets (regardless of order)
    const isDuplicateGroup = db.groups.some(
      (g) =>
        Array.isArray(g.fonts) &&
        g.fonts.length === fonts.length &&
        g.fonts.every((font) => fonts.includes(font)) &&
        fonts.every((font) => g.fonts.includes(font))
    );
    if (isDuplicateGroup) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .send(failure("A group with the same set of fonts already exists"));
    }
    const id = uuidv4();
    db.groups.push({ id, name, fonts });
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(db, null, 2));
    return res
      .status(HTTP_STATUS.CREATED)
      .send(success("Group created successfully", { id }));
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Failed to create group", err.message));
  }
};

const getGroups = (req, res) => {
  try {
    const dbContent = fs.readFileSync(DATABASE_FILE, "utf-8") || "{}";
    const db = JSON.parse(dbContent);
    const groups = db.groups || [];
    if (groups.length === 0) {
      return res.status(HTTP_STATUS.OK).send(success("No groups found", []));
    } else {
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Groups fetched successfully", groups));
    }
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Failed to fetch groups", err.message));
  }
};

const deleteGroup = (req, res) => {
  try {
    const dbContent = fs.readFileSync(DATABASE_FILE, "utf-8") || "{}";
    const db = JSON.parse(dbContent);
    const groupId = req.params.id;
    if (!groupId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Group ID required"));
    }
    const groupIndex = db.groups.findIndex((g) => g.id === groupId);
    if (groupIndex === -1) {
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Group not found"));
    }
    db.groups.splice(groupIndex, 1);
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(db, null, 2));
    return res
      .status(HTTP_STATUS.OK)
      .send(success("Group deleted successfully"));
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Failed to delete group", err.message));
  }
};

module.exports = { createGroup, getGroups, deleteGroup };
