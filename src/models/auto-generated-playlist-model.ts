import { AutoGeneratedPlaylistDocument } from "@/types";
import { models, Schema, model, Model } from "mongoose";

const autoGeneratedPlaylistSchema = new Schema<AutoGeneratedPlaylistDocument>(
  {
    title: {
      type: String,
      required: true,
    },

    items: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Audio",
      },
    ],
  },
  { timestamps: true }
);

const AutoGeneratedPlaylist =
  models.AutoGeneratedPlaylist ||
  model("AutoGeneratedPlaylist", autoGeneratedPlaylistSchema);
export default AutoGeneratedPlaylist as Model<AutoGeneratedPlaylistDocument>;
