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
        
        // user.loginStatus = false;
        // await user.save(); 
        
        //generating the user token
        const TOKEN = jwt.sign({ _id: user._id }, 'ABC_CompanySecret');
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
          userType: user.userType,
          loginStatus: user.loginStatus
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

  //login user
  const loginUser = async (req, res) => {
    if (req.body && req.body.email && req.body.password) {
      let { email, password } = req.body;
  
      new Promise(async (resolve, reject) => {
        try {
              // check if user email exists
              const user = await User.findOne({ email });
              if (!user) {
                throw new Error(enums.user.NOT_FOUND);
              }
              //compare if the entered and existing password matches
              const isMatch = await bcrypt.compare(password, user.password);
              if (!isMatch) {
                throw new Error(enums.user.PASSWORD_NOT_MATCH);
              }
       
              //generating the user token
              const TOKEN = jwt.sign({ _id: user._id }, 'ABC_CompanySecret');
              user.token = TOKEN;

              let responseData = {
                user_id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,                
                token: TOKEN,
                userType: user.userType,
              };
              return resolve({ responseData });
        } catch (error) {
          return resolve(error.message);
        }
      })
        .then((data) => {
          if (data === enums.user.NOT_FOUND) {
            LOG.warn(enums.user.NOT_FOUND);
          } else if (data === enums.user.PASSWORD_NOT_MATCH) {
            LOG.warn(enums.user.PASSWORD_NOT_MATCH);
          } else {
            LOG.info(enums.user.LOGIN_SUCCESS);
          }
          responseHandler.respond(res, data);
        })
        .catch((error) => {
          LOG.info(enums.user.LOGIN_ERROR);
          responseHandler.handleError(res, error.message);
        });
    } else {
      return responseHandler.handleError(res, enums.user.CREDENTIAL_REQUIRED);
    }
  }

  const updatePassword = async (req, res) => {
    if (req.body && req.body.oldPassword && req.body.newPassword) {
      let { oldPassword, newPassword } = req.body;

      
    }
  }

  module.exports = {
    createUser,
    loginUser
  }