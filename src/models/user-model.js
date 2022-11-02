const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName:{type:String, required:true, trim: true},
    lastName:{type:String, required:true, trim: true},
    userType:{type:String, required:true, trim: true},
    email: { type: String, required: true, trim: true },    
    phoneNumber : {type: String, required: true, trim: true, max: 10},
    password: { type: String, required: true, trim: true },    
    token:{type:String},
});

const User = mongoose.model("users", UserSchema);
module.exports = User;
