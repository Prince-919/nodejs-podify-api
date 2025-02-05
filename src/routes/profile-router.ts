import { profileController } from "@/controllers";
import { isAuth, mustAuth } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.post(
  "/update-follower/:profileId",
  mustAuth,
  profileController.updateFollower
);
router.get("/uploads", mustAuth, profileController.getUploads);
router.get("/uploads/:profileId", profileController.getPublicUploads);
router.get("/info/:profileId", profileController.getPublicProfile);
router.get("/playlist/:profileId", profileController.getPublicPlaylist);
router.get("/recommended", isAuth, profileController.getRecommendedByProfile);
router.get(
  "/auto-generated-playlist",
  mustAuth,
  profileController.getAutoGeneratedPlaylist
);
router.get("/followers", mustAuth, profileController.getFollowersProfile);
router.get(
  "/followers/:profileId",
  mustAuth,
  profileController.getFollowersProfilePublic
);
router.get("/followings", mustAuth, profileController.getFollowingsProfile);
router.get("/playlist-audios/:playlistId", profileController.getPlaylistAudios);
router.get(
  "/private-playlist-audios/:playlistId",
  mustAuth,
  profileController.getPrivatePlaylistAudios
);

router.get(
  "/is-following/:profileId",
  mustAuth,
  profileController.getIsFollowing
);
export default router;
