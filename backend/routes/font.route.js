const express = require("express");
const routes = express();
const HTTP_STATUS = require("../constants/statusCodes");
const { getFonts, uploadFont } = require("../controller/font.controller");
const { configureFontUpload } = require("../middleware/fileUpload");
const { success, failure } = require("../utilities/common");
routes.get("/", getFonts);

routes.post(
  "/",
  (req, res, next) => {
    configureFontUpload()(req, res, function (err) {
      if (err) {
        // Multer error ( invalid file type)
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Only .ttf font files are allowed!", err.message));
      }
      next();
    });
  },
  uploadFont
);

module.exports = routes;
