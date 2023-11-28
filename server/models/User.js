const mongoose = require('mongoose');

const user = new mongoose.Schema(
{
    empid:{
        type:Number,
        unique:true,
        required:[true,"Id required"]
    },
    name:{
        type:String,
        required:[true, "Name required"]
    } ,
    username:{
        type:String,
        unique:true,
        required:[true, "Username required"]
    } ,
    password:{
        type:String,
        required:[true,"Password required"]
    }
})

module.exports = mongoose.model("users",user);