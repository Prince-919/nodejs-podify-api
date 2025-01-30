import { History } from "@/models";
import { historyType } from "@/types";
import { RequestHandler } from "express";

class HistoryController {
  updateHistory: RequestHandler = async (req, res) => {
    const oldHistory = await History.findOne({ owner: req.user?.id });

    const { audio, progress, date } = req.body;

    const history: historyType = { audio, progress, date };

    if (!oldHistory) {
      await History.create({
        owner: req.user?.id,
        last: history,
        all: [history],
      });
      res.json({ success: true });
      return;
    }

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const histories = await History.aggregate([
      { $match: { owner: req.user?.id } },
      { $unwind: "$all" },
      {
        $match: {
          "all.date": {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $project: {
          _id: 0,
          audio: "$all.audio",
        },
      },
    ]);

    const sameDayHistory = histories.find((item) => {
      if (item.audio.toString() === audio) return item;
    });

    if (sameDayHistory) {
      await History.findOneAndUpdate(
        {
          owner: req.user?.id,
          "all.audio": audio,
        },
        {
          $set: {
            "all.$.progress": progress,
            "all.$.date": date,
          },
        }
      );
    } else {
      await History.findByIdAndUpdate(oldHistory._id, {
        $push: { all: { $each: [history], $position: 0 } },
        $set: { last: history },
      });
    }

    res.json({ success: true });
  };
}

const historyController = new HistoryController();
export default historyController;
