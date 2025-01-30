import { HistoryDocument } from "@/types";
import { Schema, models, model, Model } from "mongoose";

const historySchema = new Schema<HistoryDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    last: {
      audio: {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
      progress: Number,
      date: {
        type: Date,
        required: true,
      },
    },
    all: [
      {
        audio: {
          type: Schema.Types.ObjectId,
          ref: "Audio",
        },
        progress: Number,
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const History = models.History || model("History", historySchema);
export default History as Model<HistoryDocument>;
