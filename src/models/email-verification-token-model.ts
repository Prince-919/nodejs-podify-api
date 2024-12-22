import { EmailVerificationTokenDocument } from "@/types";
import { Schema, model, Model } from "mongoose";

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      expires: 3600, // 60min * 60sec = 3600sec
      default: Date.now(),
    },
  }
);

const EmailVerificationToken = model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenDocument>;
export default EmailVerificationToken;
