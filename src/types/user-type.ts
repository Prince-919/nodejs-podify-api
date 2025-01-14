import { Request } from "express";
import { ObjectId } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: any;
        name: string;
        email: string;
        verified: boolean;
        avatar?: string;
        followers: number;
        followings: number;
      };
      token: string;
    }
  }
}

export interface UserDocument {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: { url: string; publicId: string };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
}

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
export interface VerifyEmailRequest extends Request {
  body: {
    userId: string;
    token: string;
  };
}
