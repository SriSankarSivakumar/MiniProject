const mongoose = require("mongoose");
const port =3000;
module.exports = async (server) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);//Database connection
    console.log("mongo connection successful..");

    // Listening to server
    await server.listen(port, () =>
      console.log(
        `server running on  ${port} ..`
      )
    );
  } catch (error) {
    console.log("mongo connection failed..");
    console.log(error);
    process.exit(1);
  }
};
