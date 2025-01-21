import { favoriteController } from "@/controllers";
import { isVerified, mustAuth } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.post("/", mustAuth, isVerified, favoriteController.toggleFavorite);
router.get("/", mustAuth, favoriteController.getFavorites);

export default router;
