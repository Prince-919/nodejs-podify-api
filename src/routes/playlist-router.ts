import { playlistController } from "@/controllers";
import { isVerified, mustAuth, validate } from "@/middlewares";
import {
  NewPlaylistValidationSchema,
  OldPlaylistValidationSchema,
} from "@/utils";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  validate(NewPlaylistValidationSchema),
  playlistController.createPlaylist
);
router.patch(
  "/",
  mustAuth,
  validate(OldPlaylistValidationSchema),
  playlistController.updatePlaylist
);
router.delete("/", mustAuth, playlistController.removePlaylist);
router.get("/by-profile", mustAuth, playlistController.getPlaylistByProfile);

export default router;
