import { Router } from "express";
import { userController } from "@/controllers";
import { validate } from "@/middlewares";
import { CreateUserSchema, TokenAndIDValidation } from "@/utils";

const router = Router();

router.post("/create", validate(CreateUserSchema), userController.create);
router.post(
  "/verify-email",
  validate(TokenAndIDValidation),
  userController.verifyEmail
);
router.post("/re-verify-email", userController.sendVerificationToken);
router.post("/forget-password", userController.generateForgetPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidation),
  userController.isValidPassResetToken
);

export default router;
