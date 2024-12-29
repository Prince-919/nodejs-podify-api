import { RequestHandler } from "express";
import { User } from "@/models";
import { CreateUser } from "@/types";
import { generateToken, sendVerificationMail } from "@/utils";

class UserController {
  create: RequestHandler = async (req: CreateUser, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    const token = generateToken();

    sendVerificationMail(token, { name, email, userId: user._id.toString() });

    res.status(201).json({ user: { id: user._id, name, email } });
  };
}

const userController = new UserController();
export default userController;
