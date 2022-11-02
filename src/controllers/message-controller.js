const express = require("express");
const router = express.Router();

const messageController = require("../services/message-service");

module.exports =   function () {
  router.post("/create", messageController.saveMessage );
  return router;
};

