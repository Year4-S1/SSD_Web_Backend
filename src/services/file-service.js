const express = require("express");
const File = require('../models/file-model');
const enums = require('../enums/file-enums');
const responseHandler = require('../response/response-handler');
const LOG = require('../log/log');
var fs = require('fs');

//upload file
const uploadFile = async (req, res) => {
    if (req.body && req.user.userType == "MANAGER") {
      new Promise(async (resolve, reject) => {

        const file = new File();
        file.file = req.body.file;
        file.createdBy = req.body.createdBy;
        file.fileUploadedDate = new Date().toLocaleDateString();
        file.fileUploadedTime = new Date().toTimeString();
        
        await file.save();

        let responseData = {
          file_id: file._id,
          file: file.file,
          createdBy: file.createdBy ,
          fileUploadedDate: file.fileUploadedDate,
          fileUploadedTime: file.fileUploadedTime,      
        };
        return resolve({ responseData});
      })
        .then((data) => {      
            LOG.info(enums.filesave.CREATE_SUCCESS);      
  
          responseHandler.respond(res, data);
        })
        .catch((error) => {
          LOG.info(enums.filesave.CREATE_ERROR);
          responseHandler.handleError(res, error.message);
        });
    }else {
        return responseHandler.handleError(res, enums.roleIssue.ONLY_MANAGER);
      }

  }

  //view files by user 
  const viewFilesByUserId = async (req, res) => {    

    if (req.body && req.user.userType == "MANAGER" && req.user._id == req.params.id ){
        await File.find({ createdBy: req.params.id })
      .sort({ fileUploadedDate: -1 })
      .then((data) => {
        res.status(200).send({ data: data });
      })
      .catch((error) => {
        res.status(500).send({ error: error.message });
      });
    }
    else{
        return responseHandler.handleError(res, enums.roleIssue.ONLY_MANAGER);
    }

    
  };

  module.exports = {
    uploadFile,
    viewFilesByUserId
  }