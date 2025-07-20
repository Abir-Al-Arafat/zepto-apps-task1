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

const updateGroup = (req, res) => {
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
    let { name, fonts } = req.body;
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
        .send(failure("Group name and at least one font is required"));
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
    db.groups[groupIndex] = { ...db.groups[groupIndex], name, fonts };
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(db, null, 2));
    return res
      .status(HTTP_STATUS.OK)
      .send(success("Group updated successfully"));
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Failed to update group", err.message));
  }
};

const findFontInGroup = (req, res) => {
  try {
    const dbContent = fs.readFileSync(DATABASE_FILE, "utf-8") || "{}";
    const db = JSON.parse(dbContent);
    const { fontName } = req.body;
    if (!fontName) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Font name is required"));
    }
    const groups = db.groups
      .filter((group) => group.fonts.includes(fontName))
      .map((group) => group.name);
    if (groups.length > 0) {
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Font found in groups", groups));
    }
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .send(failure("Font not found in any group"));
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Failed to find font in groups", err.message));
  }
};

const deleteFontFromGroup = (req, res) => {
  try {
    const dbContent = fs.readFileSync(DATABASE_FILE, "utf-8") || "{}";
    const db = JSON.parse(dbContent);
    const { fontName } = req.body;

    if (!fontName) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Font name is required"));
    }
    console.log("db", req.body);
    console.log("fontName", fontName);

    let groupsToRemove = [];

    db.groups.forEach((group, index) => {
      if (group.fonts.includes(fontName)) {
        group.fonts = group.fonts.filter((font) => font !== fontName);
        if (group.fonts.length < 2) {
          groupsToRemove.push(index);
        }
      }
    });

    // Remove groups with less than two fonts
    for (let i = groupsToRemove.length - 1; i >= 0; i--) {
      db.groups.splice(groupsToRemove[i], 1);
    }

    fs.writeFileSync(DATABASE_FILE, JSON.stringify(db, null, 2));
    return res
      .status(HTTP_STATUS.OK)
      .send(success("Font deleted from groups successfully"));
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Failed to delete font from groups", err.message));
  }
};

module.exports = {
  createGroup,
  updateGroup,
  getGroups,
  deleteGroup,
  findFontInGroup,
  deleteFontFromGroup,
};
