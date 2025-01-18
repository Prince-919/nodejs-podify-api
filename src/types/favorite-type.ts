import { ObjectId } from "mongoose";

export interface FavoriteDocument {
  owner: ObjectId;
  items: ObjectId[];
}
