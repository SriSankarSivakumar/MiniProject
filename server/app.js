const express = require("express");
const app = express();
const dotenv = require("dotenv");
const routes = require("./routes/trackingApplicationroutes");
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use("/",routes);
dotenv.config({path:"./config/config.env"});
const db = require("./config/db");
db(app);//db connection
module.exports=app;
