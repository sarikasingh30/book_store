const { createClient } = require("redis");
require("dotenv").config();
const redisClient = createClient({
  url: process.env.REDIS_URL, // from your .env file
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

let isConnected = false;

const connectRedis = async () => {
  if (!isConnected) {
    await redisClient.connect();
    isConnected = true;
    console.log("Redis connected!");
  }
};

module.exports = { redisClient, connectRedis };
