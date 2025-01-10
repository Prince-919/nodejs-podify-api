import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { EmailVerificationToken, PasswordResetToken, User } from "@/models";
import { CreateUser, VerifyEmailRequest } from "@/types";
import {
  generateToken,
  sendForgetPasswordLink,
  sendPassResetSuccessEmail,
  sendVerificationMail,
} from "@/utils";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { config } from "@/config";

class UserController {
  create: RequestHandler = async (req: CreateUser, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    const token = generateToken();
    await EmailVerificationToken.create({
      owner: user._id,
      token,
    });

    sendVerificationMail(token, { name, email, userId: user._id.toString() });

    res.status(201).json({ user: { id: user._id, name, email } });
  };

  verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res) => {
    const { token, userId } = req.body;

    const verificaionToken = await EmailVerificationToken.findOne({
      owner: userId,
    });

    if (!verificaionToken) {
      res.status(403).json({ error: "Invalid token!" });
    }

    const matched = await verificaionToken?.compareToken(token);
    if (!matched) {
      res.status(403).json({ error: "Invalid token!" });
    }

    await User.findByIdAndUpdate(userId, { verified: true });
    await EmailVerificationToken.findByIdAndDelete(verificaionToken?._id);

    res.json({ message: "Your email is verified." });
  };

  sendVerificationToken: RequestHandler = async (req, res) => {
    const { userId } = req.body;

    if (!isValidObjectId(userId)) {
      res.status(403).json({ error: "Invalid request!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(403).json({ error: "Invalid request!" });
      return;
    }

    await EmailVerificationToken.findOneAndDelete({ owner: userId });

    const token = generateToken();

    await EmailVerificationToken.create({
      owner: userId,
      token,
    });

    sendVerificationMail(token, {
      name: user?.name,
      email: user?.email,
      userId: user?._id.toString(),
    });
    res.json({ message: "Please check you mail." });
  };

  generateForgetPasswordLink: RequestHandler = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(403).json({ error: "Account not found!" });
      return;
    }

    await PasswordResetToken.findOneAndDelete({
      owner: user._id,
    });

    const token = crypto.randomBytes(36).toString("hex");

    await PasswordResetToken.create({ owner: user._id, token });

    const resetLink = `${config.passwordResetLink}?token=${token}&userId=${user._id}`;
    sendForgetPasswordLink({ email: user.email, link: resetLink });
    res.json({ message: "Check you registered mail." });
  };

  grantValid: RequestHandler = async (req, res) => {
    res.json({ valid: true });
  };

  updatePassword: RequestHandler = async (req, res) => {
    const { password, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(403).json({ error: "Unauthorized access!" });
      return;
    }

    const matched = await user.comparePassword(password);
    if (matched) {
      res.status(422).json({ error: "The new password must be different!" });
      return;
    }

    user.password = password;
    await user.save();

    await PasswordResetToken.findOneAndReplace({ owner: user._id });

    sendPassResetSuccessEmail(user.name, user.email);
    res.json({ message: "Password resets successfully." });
  };

  signIn: RequestHandler = async (req, res) => {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(403).json({ error: "Email/Password mismatch!" });
      return;
    }

    const matched = await user.comparePassword(password);
    if (!matched) {
      res.status(403).json({ error: "Email/Password mismatch!" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret as string);
    user.tokens.push(token);

    await user.save();
    res.json({
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avatar?.url,
        followers: user.followers.length,
        followings: user.followings.length,
      },
      token,
    });
  };
}

const userController = new UserController();
export default userController;
