import { Router } from "express";
import { userController } from "@/controllers";
import { isValidPassResetToken, mustAuth, validate } from "@/middlewares";
import formidable from "formidable";
import path from "path";
import fs from "fs";
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
router.post("/update-profile", async (req, res) => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data;")) {
    res.status(422).json({ error: "Only accepts form-data!" });
    return;
  }
  const dir = path.join(__dirname, "../public/profiles");

  try {
    await fs.readdirSync(dir);
  } catch (error) {
    await fs.mkdirSync(dir);
  }

  const form = formidable({
    uploadDir: dir,
    filename(name, ext, part, form) {
      return Date.now() + "_" + part.originalFilename;
    },
  });
  form.parse(req, (err, fields, files) => {
    res.json({ uploaded: true });
  });
});

export default router;
