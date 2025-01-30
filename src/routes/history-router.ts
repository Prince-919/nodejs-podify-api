import { Router } from "express";
import { mustAuth } from "@/middlewares";
import { historyController } from "@/controllers";

const router = Router();

router.post("/", mustAuth, historyController.updateHistory);

export default router;
