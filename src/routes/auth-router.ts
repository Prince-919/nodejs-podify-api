import { validate } from "@/middlewares";
import { User } from "@/models";
import { CreateUser } from "@/types/user-type";
import { CreateUserSchema } from "@/utils";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  validate(CreateUserSchema),
  async (req: CreateUser, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.json({ user });
  }
);

export default router;
