// Call routes here
const express = require("express");
const userController = require('./controllers/user-controller')

module.exports =   function (app) {
    app.use('/user', userController())
};