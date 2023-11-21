import express from "express";
import * as loginController from "../controllers/login9";

const router = express.Router();

router.post("/", loginController.onLogin);

export default router;
