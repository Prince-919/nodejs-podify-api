import { ObjectId } from "mongoose";

export interface PasswordResetTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}
export interface Methods {
  compareToken(token: string): Promise<boolean>;
}
