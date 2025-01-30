import { Router } from "express";
import { mustAuth, validate } from "@/middlewares";
import { historyController } from "@/controllers";
import { UpdateHistorySchema } from "@/utils/validationSchema";

const router = Router();

router.post(
  "/",
  mustAuth,
  validate(UpdateHistorySchema),
  historyController.updateHistory
);

export default router;
