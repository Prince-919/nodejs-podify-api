import { RequestHandler } from "express";
import { EmailVerificationToken, User } from "@/models";
import { CreateUser, VerifyEmailRequest } from "@/types";
import { generateToken, sendVerificationMail } from "@/utils";

class UserController {
  create: RequestHandler = async (req: CreateUser, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    const token = generateToken();

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
}

const userController = new UserController();
export default userController;
