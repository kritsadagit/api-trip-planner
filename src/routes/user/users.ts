import express from "express";
import * as usersController from "../../controllers/user/users";

const router = express();

router.get("/", usersController.getUsers);
router.get("/:userId", usersController.getUser);
router.post("/", usersController.createUser);
// router.get("/:requester_id", usersController.getUsers);
// router.post("/", googleSignInUserController.createGoogleSignInUser);

export default router;
