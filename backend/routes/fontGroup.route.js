const express = require("express");
const routes = express();

const {
  createGroup,
  getGroups,
} = require("../controller/fontGroup.controller");

routes.get("/", getGroups);

routes.post("/", createGroup);

// routes.delete("/:id", deleteFont);

module.exports = routes;
