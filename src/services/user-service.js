const express = require("express");
const User = require('../models/user-model');
const enums = require('../enums/user-enum');
const responseHandler = require('../response/response-handler');
const LOG = require('../log/log');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const validator = require("validator");

//creating a new user
const createUser = async (req, res) => {
    if (req.body && req.body.email) {
      new Promise(async (resolve, reject) => {

        let userEmail = req.body.email;
        //find if user already exists
        let user = await User.findOne({ userName: userEmail });
        if (user) {
          return resolve(enums.user.ALREADY_EXIST);
        }
  
        user = new User(req.body);
        //hashing passowrd
        user.password = await bcrypt.hash(user.password, 8);

        await user.save();    
        
        //generating the user token
        const TOKEN = jwt.sign({ _id: user._id }, 'schoolapisecret');
        user.token = TOKEN;
        //saving the user token
        await user.save();

        let responseData = {
          user_id: user._id,
          firstName: user.firstName,
          lasttName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          token: TOKEN,
          userType: user.userType
        };
        return resolve({ responseData, TOKEN });
      })
        .then((data) => {
          if (data === enums.user.ALREADY_EXIST) {
            LOG.warn(enums.user.ALREADY_EXIST);
          } else {
            LOG.info(enums.user.CREATE_SUCCESS);
          }
  
          responseHandler.respond(res, data);
        })
        .catch((error) => {
          LOG.info(enums.user.CREATE_ERROR);
          responseHandler.handleError(res, error.message);
        });
    }
  }

  module.exports = {
    createUser,
  }