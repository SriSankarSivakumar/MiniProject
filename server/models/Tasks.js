const mongoose = require('mongoose');


const tasks = new mongoose.Schema(
{
    taskId:{
        type:Number
    },
    title:{
        type:String,
        required:[true, "Title required"]
    } ,
    description:{
        type:String,
        required:[true, "Description required"]
    },
    assigned_to:{
        type:String,
        required:[true, "Assigned_to required"]
    },
    status:{
        type:String,
        required:[true, "Status required"]
    },
    comments:{
        type:String,
        default:"Fill up your status description"
    },
    notification:{
        type:Number,
        default:1
    },
    
},
{timestamps:true}
)

module.exports = mongoose.model("tasks",tasks);