import { ObjectId } from "mongoose";

export interface EmailVerificationTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

export interface Methods {
  compareToken(token: string): Promise<boolean>;
}
