import { AudioDocument } from "@/types";
import { categories } from "@/utils";
import { model, models, Schema, Model } from "mongoose";

const audioSchema = new Schema<AudioDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    file: {
      type: Object,
      url: String,
      publicId: String,
      required: true,
    },
    poster: {
      type: Object,
      url: String,
      publicId: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: String,
      enum: categories,
      default: "Others",
    },
  },
  { timestamps: true }
);

const Audio =
  models.Audio || (model("Audio", audioSchema) as Model<AudioDocument>);

export default Audio;
