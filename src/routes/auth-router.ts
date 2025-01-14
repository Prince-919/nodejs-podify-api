import { Router } from "express";
import { authController } from "@/controllers";
import {
  fileParser,
  isValidPassResetToken,
  mustAuth,
  validate,
} from "@/middlewares";

import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
} from "@/utils";

const router = Router();

router.post("/create", validate(CreateUserSchema), authController.create);
router.post(
  "/verify-email",
  validate(TokenAndIDValidation),
  authController.verifyEmail
);
router.post("/re-verify-email", authController.sendVerificationToken);
router.post("/forget-password", authController.generateForgetPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidation),
  isValidPassResetToken,
  authController.grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  authController.updatePassword
);
router.post(
  "/sign-in",
  validate(SignInValidationSchema),
  authController.signIn
);
router.get("/is-auth", mustAuth, authController.sendProfile);
router.post(
  "/update-profile",
  mustAuth,
  fileParser,
  authController.updateProfile
);
router.post("/log-out", mustAuth, authController.logOut);

export default router;
