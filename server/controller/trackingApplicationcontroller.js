const Admin = require("../models/Admin")
const User = require("../models/User");
const Task = require("../models/Tasks");
const { hash, compare } = require("bcryptjs");
const {sign,verify} = require("jsonwebtoken");
const express = require("express")
const app = express();
app.use(express.json());
exports.createUserdetails = async(req,res)=>{
    const { empid,name, username, password } = req.body;
    try{
      
        const userObj = {empid,name,username};
        const hashedPwd = await hash(password, 12);
        userObj.password = hashedPwd;
        const user1 = await new User(userObj).save();

        return res.status(201).send("Registered Successfully");

    }catch(err){
        return res.status(500).send(err);
    }
}
exports.createAdmindetails = async(req,res)=>{
    const { name, username, password } = req.body;
    try{
      
        const adminObj = {name,username};
        const hashedPwd = await hash(password, 12);
        adminObj.password = hashedPwd;
        const admin_variable = await new Admin(adminObj).save();

        return res.status(201).send("Registered Successfully");

    }catch(err){
        return res.status(500).send(err);
    }
}
exports.checkUserCredentials =async (req, res) => {
    const { username, password } = req.body;
    // console.log(req.body)
    // console.log(username);
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).send("Invalid credentials");
      const isMatch = await compare(password, user.password);
      if (!isMatch) return res.status(400).send("Invalid credentials");
      const token = sign({ user }, process.env.JWT_SECRET, {expiresIn: 360000,});
      let userName =user.name;
    //   const admincheck = await isAdmin();
      return res.status(200).json({token, userName});
    //   res.status(200).send("Success");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

  exports.checkAdminCredentials =async (req, res) => {
    const { username, password } = req.body;
    // console.log(req.body)
    // console.log(username);
    try {
      const admin = await Admin.findOne({ username });
      if (!admin) return res.status(404).send("Invalid credentials");
      const isMatch = await compare(password, admin.password);
      if (!isMatch) return res.status(400).send("Invalid credentials");
      const token = sign({ admin }, process.env.JWT_SECRET, {
        expiresIn: 360000,
      });
      let adminName =admin.name;
    //   const admincheck = await isAdmin();
      return res.status(200).json({ token,adminName });
    //   res.status(200).send("Success");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };
  exports.tokenValidation= async(req,res)=>{
    // console.log(req.headers.authorisation);
    verify(req.headers.authorisation,process.env.JWT_SECRET,(err,decoded)=>{
      if(err)return res.status(401).send('Unauthorized');
      else{
        res.status(200).send('Authorized')
        console.log("decodedToken",decoded);      
        }


    })
  }

  exports.getUsersList = async (req,res)=>{
    try{
        const usersList = await User.find();
        res.status(200).json(usersList);
    }
    catch(err){
        res.status(404).send("Error" +err);
    }
}
exports.createTasks = async(req,res)=>{
    const { taskId,title, description, assigned_to, status } = req.body;
    try{
      
        const taskObj = {taskId,title, description, assigned_to, status};
        const task_variable = await new Task(taskObj).save();

        return res.status(201).send("Task Added Successfully");

    }catch(err){
        return res.status(500).send(err);
    }
}
exports.getTasksList = async (req,res)=>{
    try{
        const taskList = await Task.find();
        res.status(200).json(taskList);
    }
    catch(err){
        res.status(404).send("Error" +err);
    }
}
exports.updateTasks = async (req,res)=>{
    const id = await req.params.id;
    var taskUpdate = req.body;
    // console.log(taskUpdate);
    await Task.findByIdAndUpdate(id,taskUpdate);
    res.status(200).send("Updated Successfully");
}
exports.deleteTasks = async (req,res)=>{
    const id = await req.params.id;
    await Task.findByIdAndDelete(id)
    res.status(200).send("Deleted Successfully");

}