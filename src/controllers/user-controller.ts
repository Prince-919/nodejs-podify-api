import { User } from "@/models";
import { CreateUser } from "@/types";
import { RequestHandler } from "express";

class UserController {
  create: RequestHandler = async (req: CreateUser, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({ user });
  };
}

const userController = new UserController();
export default userController;
