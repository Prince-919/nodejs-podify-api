import { ObjectId } from "mongoose";

export type historyType = {
  audio: ObjectId;
  progress: number;
  date: Date;
};

export interface HistoryDocument {
  owner: ObjectId;
  last: historyType;
  all: historyType[];
}
