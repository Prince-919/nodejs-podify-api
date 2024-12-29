import { RequestHandler } from "express";
import { EmailVerificationToken, User } from "@/models";
import { CreateUser, VerifyEmailRequest } from "@/types";
import { generateToken, sendVerificationMail } from "@/utils";
import { isValidObjectId } from "mongoose";

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
}

const userController = new UserController();
export default userController;
