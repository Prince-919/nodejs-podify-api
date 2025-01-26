import { Router } from "express";
import authRouter from "./auth-router";
import audioRouter from "./audio-router";
import favoriteRouter from "./favorite-router";
import playlistRouter from "./playlist-router";
import profileRouter from "./profile-router";

const router = Router();

router.use("/auth", authRouter);
router.use("/audio", audioRouter);
router.use("/favorite", favoriteRouter);
router.use("/playlist", playlistRouter);
router.use("/profile", profileRouter);

export default router;
