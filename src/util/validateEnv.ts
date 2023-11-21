import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  MONGO_CONNECT_STRING: str(),
  PORT: port(),
  ACCESS_TOKEN_SECRET: str(),
  TOKEN_SECRET: str(),
});
