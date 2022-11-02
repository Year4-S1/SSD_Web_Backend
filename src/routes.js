// Call routes here
const express = require("express");
const userController = require('./controllers/user-controller')

//Message routes
const messageController = require('./controllers/message-controller')

module.exports =   function (app) {
    //API endpoints of user
    app.use('/user', userController());
    //API endpoints of message
    app.use('/message',messageController());
};