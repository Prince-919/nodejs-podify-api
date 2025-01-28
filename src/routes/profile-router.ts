import { followerController } from "@/controllers";
import { mustAuth } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.post(
  "/update-follower/:profileId",
  mustAuth,
  followerController.updateFollower
);
router.get("/uploads", mustAuth, followerController.getUploads);
router.get("/uploads/:profileId", followerController.getPublicUploads);

export default router;
