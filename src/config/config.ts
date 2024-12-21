import dotenv from "dotenv";
dotenv.config();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGODB_CONNECTION_STRING,
};

const config = Object.freeze(_config);
export default config;
