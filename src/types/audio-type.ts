import { ObjectId } from "mongoose";
import { categoriesTypes } from "./audio-category-type";
import { RequestWithFiles } from "@/middlewares";

export interface AudioDocument<T = ObjectId> {
  _id: ObjectId;
  title: string;
  about: string;
  owner: T;
  file: {
    url: string;
    publicId: string;
  };
  poster?: {
    url: string;
    publicId: string;
  };
  likes: ObjectId[];
  category: categoriesTypes;
  createdAt: Date;
}

export interface CreateAudioRequest extends RequestWithFiles {
  body: {
    title: string;
    about: string;
    category: categoriesTypes;
  };
}

export type PopulateFavList = AudioDocument<{ _id: ObjectId; name: string }>;
