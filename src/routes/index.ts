import { Router } from "express";
import authRouter from "./auth-router";
import audioRouter from "./audio-router";

const router = Router();

router.use("/auth", authRouter);
router.use("/audio", audioRouter);

export default router;
