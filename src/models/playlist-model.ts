import { PlaylistDocument } from "@/types";
import { models, Schema, model, Model } from "mongoose";

const playlistSchema = new Schema<PlaylistDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Audio",
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private", "auto"],
      default: "public",
    },
  },
  { timestamps: true }
);

const Playlist = models.Playlist || model("Playlist", playlistSchema);
export default Playlist as Model<PlaylistDocument>;
