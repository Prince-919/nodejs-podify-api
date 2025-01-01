import { PasswordResetToken } from "@/models";
import { RequestHandler } from "express";

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;

  const resetToken = await PasswordResetToken.findOne({ owner: userId });
  if (!resetToken) {
    res.status(403).json({ error: "Unauthorized access, invalid token!" });
    return;
  }

  const matched = await resetToken?.compareToken(token);
  if (!matched) {
    res.status(403).json({ error: "Unauthorized access, invalid token!" });
    return;
  }

  next();
};
