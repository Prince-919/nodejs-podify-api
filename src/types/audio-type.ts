import { ObjectId } from "mongoose";
import { categoriesTypes } from "./audio-category-type";

export interface AudioDocument {
  title: string;
  about: string;
  owner: ObjectId;
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
}
