import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import bodyParser from "body-parser";

import oauthRoutes from "./routes/oauth";
import usersRoutes from "./routes/user/users";
import friendRequestsRoutes from "./routes/friend_requests/friend_requests";
import friendsListRoutes from "./routes/friends_list/friends_list";
import geolocationRoutes from "./routes/geolocation/geolocation";

import { accessTokenValidate } from "./controllers/oauth";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/api/oauth", oauthRoutes);
app.use("/api/users", accessTokenValidate, usersRoutes);
app.use("/api/friend_requests", accessTokenValidate, friendRequestsRoutes);
app.use("/api/friends_list", accessTokenValidate, friendsListRoutes);
app.use("/api/geolocation", accessTokenValidate, geolocationRoutes);


app.use((req: Request, res: Response, next: NextFunction) => {
  // next(Error("Endpoint not found"));
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  // console.log("isHttpError(error): ", isHttpError(error));

  // let errorMessage = "An unknown error occured";

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const errorMessage = error.message;
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    // errorMessage = error.message;
  }

  res.status(statusCode).json({
    result: false,
    error: errorMessage,
    msg: errorMessage,
  });
});

export default app;
