import { followerController } from "@/controllers";
import { isAuth, mustAuth } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.post(
  "/update-follower/:profileId",
  mustAuth,
  followerController.updateFollower
);
router.get("/uploads", mustAuth, followerController.getUploads);
router.get("/uploads/:profileId", followerController.getPublicUploads);
router.get("/info/:profileId", followerController.getPublicProfile);
router.get("/playlist/:profileId", followerController.getPublicPlaylist);
router.get("/recommended", isAuth, followerController.getRecommendedByProfile);

export default router;
