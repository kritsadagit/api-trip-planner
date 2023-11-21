import express from "express";
import * as OauthController from "../controllers/oauth";

const router = express.Router();

router.post("/token", OauthController.getOauthToken);

export default router;
