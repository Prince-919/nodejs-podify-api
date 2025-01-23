import { Request } from "express";
import { ObjectId } from "mongoose";

export interface PlaylistDocument {
  title: string;
  owner: ObjectId;
  items: ObjectId[];
  visibility: "public" | "private" | "auto";
}

export interface CreatePlaylistRequest extends Request {
  body: {
    title: string;
    resId: string;
    visibility: "public" | "private";
  };
}
export interface UpdatePlaylistRequest extends Request {
  body: {
    title: string;
    item: string;
    id: string;
    visibility: "public" | "private";
  };
}
