import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import env from "../util/validateEnv";
import createHttpError from "http-errors";

interface OauthBody {
  grant_type: string;
  client_id: string;
  client_secret: string;
}

interface Payload {
  grant_type: string;
  client_id: string;
  client_secret: string;
}

const accessTokenGenerate = (payload: Payload): string => {
  const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET);
  return accessToken;
};

export const accessTokenValidate: RequestHandler = (req, res, next) => {
  try {
    if (!req.headers["authorization"])
      throw createHttpError(401, "Unauthorized");

    const token = req.headers["authorization"].replace("Bearer ", "");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) throw createHttpError(403, "Forbidden Access");
    });

    // console.log("token: ", token);

    next();
  } catch (error) {
    throw createHttpError(401, "Unauthorized");
  }
};

export const getOauthToken: RequestHandler<
  unknown,
  unknown,
  OauthBody,
  unknown
> = async (req, res, next) => {
  const { grant_type, client_id, client_secret } = req.body;
  const payload = {
    grant_type,
    client_id,
    client_secret,
  };
  console.log("grant_type: ", grant_type);
  
  try {
    res.status(200).json({
      result: true,
      access_token: accessTokenGenerate(payload),
      msg: "Success",
    });
  } catch (error) {
    next(error);
  }
};
