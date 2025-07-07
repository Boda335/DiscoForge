const NEXUS = require("./Client");
const mongoose = require("mongoose");

/**
 * @param {NEXUS} client
 */
module.exports = async (client) => {
  const mongoURL = client.config.MONGO_URL;

  if (
    !mongoURL ||
    mongoURL.trim() === "" ||
    mongoURL.includes("YOUR_MONGO_URL")
  ) {
    client.log(["warningColor", "WARNING:"],["1", "MongoDB URL is not provided or is set to the default placeholder. Skipping MongoDB connection."]);
    return;
  }

  try {
    await mongoose.connect(mongoURL);
    client.log(["successColor", "SUCCESS:"], ["1", "Connected to MongoDB."]);
  } catch (error) {
    client.log("errorColor", "✖ Failed to connect to MongoDB:");
    console.error(error); // نطبع الخطأ العادي
  }
};
