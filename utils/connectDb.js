const mongoose = require("mongoose");
const config = require("../config/config");

const connectDb = async () => {
  try {
    mongoose.connect(config.prod ? config.MONGO_URI : config.LOCAL_DB);
    const connection = mongoose.connection;

    connection.once("open", () => {
      console.log("Connected to DB");
    });
  } catch (err) {
    console.error(err, "Failed to connect to DB");
  }
};

module.exports = connectDb;
