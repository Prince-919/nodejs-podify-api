import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import path from "path";
import { EmailVerificationToken, User } from "@/models";
import { CreateUser } from "@/types";
import { config } from "@/config";
import { generateToken } from "@/utils";
import { generateTemplate } from "@/mail";

class UserController {
  create: RequestHandler = async (req: CreateUser, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    res.status(201).json({ user });
  };
}

const userController = new UserController();
export default userController;
