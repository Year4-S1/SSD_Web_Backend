const express = require("express");
const router = express.Router();

const userController = require("../services/user-service");

module.exports =   function () {
  router.post("/create", userController.createUser );
  router.post("/login", userController.loginUser );
  return router;
};
