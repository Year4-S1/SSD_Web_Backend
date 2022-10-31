const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{type:String, required:true, trim: true},
    usertype:{type:String, required:true, trim: true},
    email: { type: String, required: true, trim: true },
    phoneNumber : {type: String, required: true, trim: true, max: 10},
    password: { type: String, required: true, trim: true },    
    token:{type:String, required:true, trim: true},
});

const User = mongoose.model("users", UserSchema);
module.exports = User;