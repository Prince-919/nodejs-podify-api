import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { User } from "@/models";
import { CreateUser } from "@/types";
import { config } from "@/config";

class UserController {
  create: RequestHandler = async (req: CreateUser, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: config.mailtrapUser,
        pass: config.mailtrapPass,
      },
    });
    transport.sendMail({
      to: user.email,
      from: "auth@myapp.com",
      html: "<h1>123426</h1>",
    });
    res.status(201).json({ user });
  };
}

const userController = new UserController();
export default userController;
