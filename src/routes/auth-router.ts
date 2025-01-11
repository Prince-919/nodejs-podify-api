import { Router } from "express";
import { userController } from "@/controllers";
import { isValidPassResetToken, mustAuth, validate } from "@/middlewares";
import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
} from "@/utils";

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
  isValidPassResetToken,
  userController.grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  userController.updatePassword
);
router.post(
  "/sign-in",
  validate(SignInValidationSchema),
  userController.signIn
);
router.get("/is-auth", mustAuth, (req, res) => {
  res.json({ profile: req.user });
});

export default router;
