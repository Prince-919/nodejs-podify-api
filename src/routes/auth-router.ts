import { Router } from "express";
import { userController } from "@/controllers";
import { validate } from "@/middlewares";
import { CreateUserSchema, EmailVerificationBody } from "@/utils";

const router = Router();

router.post("/create", validate(CreateUserSchema), userController.create);
router.post(
  "/verify-email",
  validate(EmailVerificationBody),
  userController.verifyEmail
);

export default router;
