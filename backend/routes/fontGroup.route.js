const express = require("express");
const routes = express();
const multer = require("multer");
const upload = multer();

const {
  createGroup,
  getGroups,
} = require("../controller/fontGroup.controller");

routes.get("/", getGroups);

routes.post("/", upload.none(), createGroup);

// routes.delete("/:id", deleteFont);

module.exports = routes;
