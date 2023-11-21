import express from "express";
import * as friendListController from "../../controllers/friends_list/friends_list";

const router = express();

router.get("/", friendListController.getFriendsList);

export default router;
