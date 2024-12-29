import dotenv from "dotenv";
dotenv.config();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGODB_CONNECTION_STRING,
  mailtrapUser: process.env.MAILTRAP_USER,
  mailtrapPass: process.env.MAILTRAP_PASS,
  verificationEmail: process.env.VERIFICATION_EMAIL,
};

const config = Object.freeze(_config);
export default config;
