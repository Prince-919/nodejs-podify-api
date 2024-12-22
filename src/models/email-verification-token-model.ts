import { Schema, model, Model } from "mongoose";
import { hash, compare } from "bcrypt";
import { EmailVerificationTokenDocument, Methods } from "@/types";

const emailVerificationTokenSchema = new Schema<
  EmailVerificationTokenDocument,
  {},
  Methods
>({
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
});

emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
  next();
});

emailVerificationTokenSchema.methods.compareToken = async function (
  token: string
) {
  const result = await compare(token, this.token);
  return result;
};

const EmailVerificationToken = model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenDocument, {}, Methods>;
export default EmailVerificationToken;
