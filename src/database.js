const { connect, set } = require("mongoose");

const connectDB = async () => {
  try {
    set("strictQuery", false);
    await connect(process.env.mongodb_url);
    console.log("Database connected!");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { connectDB };
