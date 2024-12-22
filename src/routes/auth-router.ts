import { Router } from "express";
import { userController } from "@/controllers";
import { validate } from "@/middlewares";
import { CreateUserSchema } from "@/utils";

const router = Router();

router.post("/create", validate(CreateUserSchema), userController.create);

export default router;
