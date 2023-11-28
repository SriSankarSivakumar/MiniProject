const mongoose = require('mongoose');

const admin = new mongoose.Schema(
{
    name:{
        type:String,
        required:[true, "Name required"]
    } ,
    username:{
        type:String,
        required:[true, "Username required"]
    } ,
    password:{
        type:String,
        required:[true,"Password required"]
    }
})

module.exports = mongoose.model("admins",admin);