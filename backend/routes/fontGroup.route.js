const express = require("express");
const routes = express();
const multer = require("multer");
const upload = multer();

const {
  createGroup,
  updateGroup,
  getGroups,
  deleteGroup,
} = require("../controller/fontGroup.controller");

routes.get("/", getGroups);

routes.post("/", upload.none(), createGroup);

routes.delete("/:id", deleteGroup);

routes.put("/:id", upload.none(), updateGroup);

module.exports = routes;
