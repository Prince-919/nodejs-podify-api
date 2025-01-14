import { config } from "@/config";
import { PasswordResetToken, User } from "@/models";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

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

export const mustAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];
  if (!token) {
    res.status(403).json({ error: "Unauthorized request!" });
    return;
  }
  const payload = verify(token, config.jwtSecret as string) as JwtPayload;
  const id = payload?.userId;

  const user = await User.findOne({ _id: id, tokens: token });
  if (!user) {
    res.status(403).json({ error: "Unauthorized request!" });
    return;
  }

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  };
  req.token = token;

  next();
};
