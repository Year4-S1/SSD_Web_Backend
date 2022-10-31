const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{type:String, required:false, trim: true},
    usertype:{type:String, required:false, trim: true},
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },    
    token:{type:String, required:true, trim: true},
});

const User = mongoose.model("users", UserSchema);
module.exports = User;