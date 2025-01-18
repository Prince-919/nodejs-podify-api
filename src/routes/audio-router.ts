import { Router } from "express";
import { fileParser, isVerified, mustAuth, validate } from "@/middlewares";
import { AudioValidationSchema } from "@/utils";
import { audioController } from "@/controllers";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  audioController.createAudio
);

export default router;
