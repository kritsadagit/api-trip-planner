import express from "express";
import * as friendRequestsController from "../../controllers/friend_request/friend_requests";

const router = express();

router.get("/", friendRequestsController.getFriendRequests);
router.get("/sending_request", friendRequestsController.sendingRequests);
router.post("/create", friendRequestsController.createFriendRequest);
router.patch("/approve", friendRequestsController.updateApproveFriendRequest);
router.delete(
  "/cancel/:friend_request_id",
  friendRequestsController.cancelFriendRequest
);

export default router;
