import { RequestHandler } from "express";
import FriendRequestModel from "../../models/friend_request/friend_request";
import FriendListModel from "../../models/friends_list/friend_list";
import mongoose from "mongoose";
import { getUTC7Isodate } from "../../util/utils";

interface IGetFriendRequestsParam {
  // requester_id?: mongoose.Types.ObjectId;
  receiver_id: mongoose.Types.ObjectId;
}

interface IGetSendingRequestsParam {
  requester_id: mongoose.Types.ObjectId;
  // receiver_id: mongoose.Types.ObjectId;
}

interface IGetFriendRequestsBody {
  requester_id: mongoose.Types.ObjectId;
  receiver_id: mongoose.Types.ObjectId;
}

type CreateFriendRequestBody = {
  requester_id: mongoose.Types.ObjectId;
  receiver_id: mongoose.Types.ObjectId;
  status_request?: 0 | 1 | 2; //0=requested, 1=approved, 2=rejected
  createAt: string;
};

interface ICancelFriendRequestParams {
  friend_request_id: mongoose.Types.ObjectId;
}

export const getFriendRequests: RequestHandler<
  unknown,
  unknown,
  unknown,
  IGetFriendRequestsParam
> = async (req, res, next) => {
  let receiver_id = req.query.receiver_id;

  try {
    if (!mongoose.isValidObjectId(receiver_id)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid receiver id",
      });
    }

    receiver_id = new mongoose.Types.ObjectId(receiver_id);

    if (!receiver_id) {
      return res.status(400).json({
        result: false,
        msg: "Bad Request",
      });
    }

    const lookupFriendRequestUser = await FriendRequestModel.aggregate([
      {
        $match: {
          receiver_id,
          status_request: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "requester_id",
          foreignField: "_id",
          as: "requester_data",
        },
      },
      {
        $unwind: "$requester_data",
      },
      {
        $project: {
          requester_id: 1,
          receiver_id: 1,
          status_request: 1,
          createAt: 1,
          requester_data: {
            email: "$requester_data.user_data.user.email",
            familyName: "$requester_data.user_data.user.familyName",
            givenName: "$requester_data.user_data.user.givenName",
            id: "$requester_data.user_data.user.id",
            name: "$requester_data.user_data.user.name",
            photo: "$requester_data.user_data.user.photo",
          },
        },
      },
    ]).exec();

    res.status(200).json({
      result: true,
      msg: "Success",
      data: lookupFriendRequestUser,
    });
  } catch (error) {
    next(error);
  }
};

export const sendingRequests: RequestHandler<
  unknown,
  unknown,
  unknown,
  IGetSendingRequestsParam
> = async (req, res, next) => {
  let requester_id = req.query.requester_id;
  console.log("requester_id: ", requester_id);

  try {
    if (!mongoose.isValidObjectId(requester_id)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid requester_id id",
      });
    }

    requester_id = new mongoose.Types.ObjectId(requester_id);

    if (!requester_id) {
      return res.status(400).json({
        result: false,
        msg: "Bad Request",
      });
    }

    const lookupSendingRequestUser = await FriendRequestModel.aggregate([
      {
        $match: {
          requester_id,
          status_request: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver_id",
          foreignField: "_id",
          as: "receiver_data",
        },
      },
      {
        $unwind: "$receiver_data",
      },
      {
        $project: {
          requester_id: 1,
          receiver_id: 1,
          status_request: 1,
          createAt: 1,
          receiver_data: {
            email: "$receiver_data.user_data.user.email",
            familyName: "$receiver_data.user_data.user.familyName",
            givenName: "$receiver_data.user_data.user.givenName",
            id: "$receiver_data.user_data.user.id",
            name: "$receiver_data.user_data.user.name",
            photo: "$receiver_data.user_data.user.photo",
          },
        },
      },
    ]).exec();

    res.status(200).json({
      result: true,
      msg: "Success",
      data: lookupSendingRequestUser,
    });
  } catch (error) {
    next(error);
  }
};

export const createFriendRequest: RequestHandler<
  unknown,
  unknown,
  CreateFriendRequestBody,
  unknown
> = async (req, res, next) => {
  let { requester_id, receiver_id } = req.body;
  const status_request = req.body.status_request;

  try {
    if (
      !mongoose.isValidObjectId(requester_id) ||
      !mongoose.isValidObjectId(receiver_id)
    ) {
      return res.status(400).json({
        result: false,
        msg: "Invalid object id",
      });
    }

    requester_id = new mongoose.Types.ObjectId(requester_id);
    receiver_id = new mongoose.Types.ObjectId(receiver_id);

    const friendRequest = await FriendRequestModel.findOne({
      requester_id,
      receiver_id,
    }).exec();

    const friendSending = await FriendRequestModel.findOne({
      requester_id: receiver_id,
      receiver_id: requester_id,
    }).exec();

    if (friendRequest) {
      return res.status(409).json({
        result: false,
        msg: "Duplicate request",
      });
    }

    if (friendSending) {
      return res.status(409).json({
        result: false,
        msg: "Already exist request",
      });
    }

    console.log("status_request: ", status_request);

    const newFriendRequest = await FriendRequestModel.create({
      requester_id,
      receiver_id,
      status_request: 0,
      createAt: getUTC7Isodate(),
    });

    res.status(201).json({
      result: true,
      msg: "Created request",
      data: newFriendRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApproveFriendRequest: RequestHandler<
  unknown,
  unknown,
  IGetFriendRequestsBody,
  unknown
> = async (req, res, next) => {
  let { requester_id, receiver_id } = req.body;
  try {
    requester_id = new mongoose.Types.ObjectId(requester_id);
    receiver_id = new mongoose.Types.ObjectId(receiver_id);

    if (
      !mongoose.isValidObjectId(requester_id) ||
      !mongoose.isValidObjectId(receiver_id)
    ) {
      return res.status(400).json({
        result: false,
        msg: "Invalid object id",
      });
    }

    const friendRequest = await FriendRequestModel.findOne({
      requester_id,
      receiver_id,
    }).exec();

    if (!friendRequest) {
      return res.status(404).json({
        result: false,
        msg: "Request not found",
      });
    }

    await FriendRequestModel.findOneAndUpdate(
      {
        requester_id,
        receiver_id,
      },
      { status_request: 1, approveAt: getUTC7Isodate() },
      { new: true }
    ).exec();
    // res.status(204).send();

    const friendsList = await FriendListModel.findOne({
      user_id: receiver_id,
    }).exec();

    if (!friendsList) {
      const newFriendsList = await FriendListModel.create({
        user_id: receiver_id,
        friends_list: requester_id,
      });

      res.status(201).json({
        result: true,
        msg: "Created friend list",
        data: newFriendsList,
      });
    } else {
      const updateFriendsList = await FriendListModel.findOneAndUpdate(
        {
          user_id: receiver_id,
        },
        {
          $addToSet: {
            friends_list: requester_id,
          },
        },
        { new: true }
      ).exec();

      res.status(200).json({
        result: true,
        msg: "Updated friend list",
        data: updateFriendsList,
      });
    }

    const reverseFriendsList = await FriendListModel.findOne({
      user_id: requester_id,
    }).exec();

    if (!reverseFriendsList) {
      await FriendListModel.create({
        user_id: requester_id,
        friends_list: receiver_id,
      });
    } else {
      await FriendListModel.findOneAndUpdate(
        { user_id: requester_id },
        { $addToSet: { friends_list: receiver_id } },
        { new: true }
      ).exec();
    }
  } catch (error) {
    next(error);
  }
};

export const cancelFriendRequest: RequestHandler<
  ICancelFriendRequestParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { friend_request_id } = req.params;
  try {
    if (!mongoose.isValidObjectId(friend_request_id)) {
      return res.status(400).json({
        result: false,
        msg: "Bad request",
      });
    }

    const friendRequest = await FriendRequestModel.findOneAndDelete(
      { _id: friend_request_id, status_request: 0 },
      { new: true }
    ).exec();

    if (!friendRequest) {
      return res.status(404).json({
        result: false,
        msg: "Request id not found to delete",
      });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
