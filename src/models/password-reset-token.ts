import { Schema, model, Model } from "mongoose";
import { hash, compare } from "bcrypt";
import { Methods, PasswordResetTokenDocument } from "@/types";

const passwordResetTokenSchema = new Schema<
  PasswordResetTokenDocument,
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

passwordResetTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
  next();
});

passwordResetTokenSchema.methods.compareToken = async function (token: string) {
  const result = await compare(token, this.token);
  return result;
};

const PasswordResetToken = model(
  "PasswordResetToken",
  passwordResetTokenSchema
) as Model<PasswordResetTokenDocument, {}, Methods>;
export default PasswordResetToken;
