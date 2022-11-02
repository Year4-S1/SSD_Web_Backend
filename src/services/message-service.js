const express = require("express");
const Message = require("../models/message-model");
const enums = require("../enums/message-enums");
const LOG = require("../log/log");
const responseHandler = require("../response/response-handler");

const saveMessage = async (req, res) => {
  if (req.body) {
    const message = new Message();
    message.createdBy = req.body.createdBy;
    message.title = req.body.title;
    message.message = req.body.message;
    message.messageDate = new Date().toLocaleDateString();
    message.messageTime = new Date().toTimeString();
    await message
      .save()
      .then((data) => {
        res.status(200).send({ data: data });
      })
      .catch((error) => {
        res.status(500).send({ error: error.message });
      });
  }
};

module.exports = {
  saveMessage
}

