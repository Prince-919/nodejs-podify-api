import fileParser, { RequestWithFiles } from "./file-parser-middleware";
import { validate } from "./validator-middleware";
import { errorHandler } from "./error";
import {
  isValidPassResetToken,
  mustAuth,
  isVerified,
  isAuth,
} from "./auth-middleware";

export {
  validate,
  isValidPassResetToken,
  mustAuth,
  isAuth,
  fileParser,
  isVerified,
  errorHandler,
  RequestWithFiles,
};
