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
  await Message.find({})
    .sort({ messageDate: -1})
    .then((data) => {
      // let decryptedData = decipher.update({message}, "hex", "utf-8");
      // decryptedData += decipher.final("utf8");
      res.status(200).send({ data: data}); 
    })
    .catch((error) => {
      res.status(500).send({ error: error.message });
    });
};


//Get Messages By ID
// const getMessageById = async(req,res,next) => {
//   if (req.params && req.params.id) {
//     await Message.findById(req.params.id)
//       .populate('createdBy', enums.message.MESSAGE_DATA)
//       .then((data) => {
//         responseHandler.sendRespond(res, data);
//         next();
//       })
//       .catch((error) => {
//         responseHandler.sendRespond(res, error.message);
//         next();
//       });
//   } else {
//     responseHandler.sendRespond(res, enums.user.NOT_FOUND);
//     return;
//   }
// };

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
          res.status(500).send(body);
        } else {
          res.status(200).send(result);
        }
      }
    )
  }
};

module.exports = {
  saveMessage,
  getAllMessages,
  editMessageInfo,
 // getMessageById
}

