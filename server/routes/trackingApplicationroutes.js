const express=require('express');
const trackingApplicationcontroller = require('../controller/trackingApplicationcontroller');
const router=express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.post("/register",trackingApplicationcontroller.createUserdetails);
// router.post("/adminregister",trackingApplicationcontroller.createAdmindetails);
router.post("/login",trackingApplicationcontroller.checkUserCredentials);
router.post("/adminlogin",trackingApplicationcontroller.checkAdminCredentials);
router.get('/validateToken',trackingApplicationcontroller.tokenValidation);
router.post("/task",trackingApplicationcontroller.createTasks);
router.get("/task",trackingApplicationcontroller.getTasksList);
router.put("/task/:id",trackingApplicationcontroller.updateTasks);
router.delete("/task/:id",trackingApplicationcontroller.deleteTasks);
router.get("/usersList",trackingApplicationcontroller.getUsersList);
module.exports=router;