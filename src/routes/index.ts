import { Router } from "express";
import authRouter from "./auth-router";
import audioRouter from "./audio-router";
import favoriteRouter from "./favorite-router";

const router = Router();

router.use("/auth", authRouter);
router.use("/audio", audioRouter);
router.use("/favorite", favoriteRouter);

export default router;
