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

router.patch(
  "/:audioId",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  audioController.updateAudio
);

router.get("/latest", audioController.getLatestUploads);

export default router;
