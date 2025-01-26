import { followerController } from "@/controllers";
import { mustAuth } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.post(
  "/update-follower/:profileId",
  mustAuth,
  followerController.updateFollower
);

export default router;
