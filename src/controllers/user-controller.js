const express = require("express");
const router = express.Router();

const userController = require("../services/user-service");

module.exports =   function () {
  router.post("/create", userController.createUser );
  return router;
};
