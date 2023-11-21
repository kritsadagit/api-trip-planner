import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

mongoose
  .connect(env.MONGO_CONNECT_STRING)
  .then(() => {
    console.log("Mongoose connected");

    app.listen(port, () => {
      console.log("Server running on port: ", port);
    });
  })
  .catch((error) => console.log(error));
