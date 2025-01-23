import { isVerified, mustAuth, validate } from "@/middlewares";
import { NewPlaylistValidationSchema } from "@/utils";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  validate(NewPlaylistValidationSchema)
);

export default router;
