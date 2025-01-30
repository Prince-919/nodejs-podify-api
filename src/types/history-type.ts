import { ObjectId } from "mongoose";

type historyType = {
  audio: ObjectId;
  progress: number;
  date: Date;
};

export interface HistoryDocument {
  owner: ObjectId;
  last: historyType;
  all: historyType[];
}
