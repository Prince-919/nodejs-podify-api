import { Router } from "express";
import { mustAuth, validate } from "@/middlewares";
import { historyController } from "@/controllers";
import { UpdateHistorySchema } from "@/utils";

const router = Router();

router.post(
  "/",
  mustAuth,
  validate(UpdateHistorySchema),
  historyController.updateHistory
);
router.delete("/", mustAuth, historyController.removeHistory);
router.get("/", mustAuth, historyController.getHistories);

export default router;
