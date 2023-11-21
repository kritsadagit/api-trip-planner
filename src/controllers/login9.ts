import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user9";
import createHttpError from "http-errors";
import { compareHash } from "../util/utils";
import env from "../util/validateEnv";

interface loginBody {
  username: string;
  password: string;
}

interface Payload {
  username: string;
  password: string;
}

const tokenGenerate = (payload: Payload): string => {
  const token = jwt.sign(payload, env.TOKEN_SECRET);
  return token;
};

// export const TokenValidate: RequestHandler = (req, res, next) => {
//   try {
//     if (!req.headers["authorization"])
//       throw createHttpError(401, "Unauthorized");

//     const access_token = req.headers["authorization"].replace("Bearer ", "");

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     jwt.verify(access_token, env.TOKEN_SECRET, (err, decoded) => {
//       if (err) throw createHttpError(403, "Forbidden Access");
//     });

//     next();
//   } catch (error) {
//     throw createHttpError(401, "Unauthorized");
//   }
// };

export const onLogin: RequestHandler<
  unknown,
  unknown,
  loginBody,
  unknown
> = async (req, res, next) => {
  const { username, password } = req.body;
  if (!req.headers["authorization"]) throw createHttpError(401, "Unauthorized");

  try {
    if (!username) {
      throw createHttpError(404, "User not found");
    }

    if (!password) {
      throw createHttpError(400, "Password is require");
    }

    const existingUser = await userModel.findOne({ username: username }).exec();
    if (existingUser) {
      const isValidatedPassword = await compareHash(
        existingUser.password,
        password
      );
      if (isValidatedPassword) {
        res.status(200).json({
          result: true,
          token: tokenGenerate({ username, password }),
          msg: "Success",
        });
      } else {
        res.status(403).json({
          result: false,
          msg: "Forbidden access",
        });
      }
    } else {
      res.status(403).json({
        result: false,
        msg: "Forbidden access",
      });
    }
  } catch (error) {
    next(error);
  }
};
