const express = require("express");
const Message = require("../models/message-model");
const enums = require("../enums/message-enums");
const LOG = require("../log/log");
const responseHandler = require("../response/response-handler");
//Message encryption imports
const crypto = require ("crypto");

const { message } = require("../enums/message-enums");
const algorithm = "aes-256-cbc"; 
// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);
// secret key generate 32 bytes of random data
const Securitykey = crypto.randomBytes(32);
// the cipher function
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
// the decipher function
const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

//Save Message Function
const saveMessage = async (req, res) => {
  if (req.body) {
    const message = new Message();
    message.createdBy = req.body.createdBy;
    message.title = req.body.title;
     //encrypt message
    let encryptedData = cipher.update(req.body.message, "utf-8", "hex");
    encryptedData += cipher.final("hex")
    message.message =encryptedData;
    message.messageDate = new Date().toLocaleDateString();
    message.messageTime = new Date().toTimeString();
    await message
      .save()
      .then((data) => {
        responseHandler.respond(res, data);
        LOG.info(enums.messagesave.CREATE_SUCCESS);
      })
      .catch((error) => {
        responseHandler.handleError(res, error.message);
        LOG.info(enums.messagesave.CREATE_ERROR);
      });
  }
};



//View all Messages Function
const getAllMessages = async (req, res) =>{
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  let decryptedData = decipher.update({message: req.params.message}, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
  await Message.find({ message: decryptedData})
    .sort({ messageDate: -1})
    .then((data) => {
      res.status(200).send({ data: data}); 
    })
    .catch((error) => {
      res.status(500).send({ error: error.message });
    });
};


//Get Messages By User ID
const viewMessageByUserId = async (req, res) => {
  await Message.find({ createdBy: req.params.id })
    .sort({ messageDate: -1 })
    .then((data) => {
      res.status(200).send({ data: data });
    })
    .catch((error) => {
      res.status(500).send({ error: error.message });
    });
};


//Update Message 
const editMessageInfo = async(req, res) => {
  if (!req.is("application/json")) {
    res.send(400);
  } else {
    Message.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          message: req.body.message,
          messageDate: new Date().toLocaleDateString(),
          messageTime: new Date().toTimeString(),
        },
      },
      { upsert: true },
      function (err, result) {
        if (err) {
          responseHandler.handleError(res, err.message);
          LOG.info(enums.messagesave.UPDATE_ERROR);
        } else {
          responseHandler.respond(res, result);
          LOG.info(enums.messagesave.UPDATE_SUCCESS);
        }
      }
    )
  }
};


//remove messages
const deleteMessage = async (req,res) => {
  //check if the req body is empty
  const id = req.params.id;
  console.log(id);
  //delete product data from database
  await Message.findByIdAndDelete(id)
    .then((response) => {
      console.log("Data sucessfully deleted!");
      responseHandler.respond(response);
      LOG.info(enums.messagesave.DELETE_SUCCESS);
    })
    .catch((error) => {
      responseHandler.handleError(res, error);
      LOG.info(enums.messagesave.DELETE_ERROR);
    });
};


module.exports = {
  saveMessage,
  getAllMessages,
  editMessageInfo,
  deleteMessage,
  viewMessageByUserId,
 // getMessageById
}

