import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { EmailVerificationToken, User } from "@/models";
import { CreateUser } from "@/types";
import { config } from "@/config";
import { generateOTP } from "@/utils";

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

    const otp = generateOTP();

    await EmailVerificationToken.create({
      owner: user._id,
      token: otp,
    });

    transport.sendMail({
      to: user.email,
      from: "auth@myapp.com",
      html: `<h1>Your verification token is ${otp}.</h1>`,
    });
    res.status(201).json({ user });
  };
}

const userController = new UserController();
export default userController;
