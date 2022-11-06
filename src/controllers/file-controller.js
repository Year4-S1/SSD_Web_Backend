const express = require("express");
const router = express.Router();

const fileController = require("../services/file-service");
const auth = require("../middleware/authentication");

module.exports =   function () {
  router.post("/upload", auth, fileController.uploadFile );
  router.get("/:id", auth , fileController.viewFilesByUserId );
  return router;
};