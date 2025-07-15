const express = require("express");
const routes = express();
const { getFonts } = require("../controller/font.controller");

routes.get("/", getFonts);

module.exports = routes;
