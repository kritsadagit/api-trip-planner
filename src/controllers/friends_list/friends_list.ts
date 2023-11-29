import { RequestHandler } from "express";
import FriendsListModel from "../../models/friends_list/friend_list";
import mongoose from "mongoose";

interface IGetFriendRequestsQuery {
  user_id: mongoose.Types.ObjectId;
}

export const getFriendsList: RequestHandler<
  unknown,
  unknown,
  unknown,
  IGetFriendRequestsQuery
> = async (req, res, next) => {
  let user_id = req.query.user_id;

  try {
    if (!mongoose.isValidObjectId(user_id)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid object id",
      });
    }

    if (!user_id) {
      return res.status(400).json({
        result: false,
        msg: "Bad Request",
      });
    }

    user_id = new mongoose.Types.ObjectId(user_id);

    const lookupFriendsList = await FriendsListModel.aggregate([
      {
        $match: {
          user_id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "friends_list",
          foreignField: "_id",
          as: "friends_list",
        },
      },
      {
        $lookup: {
          from: "friend_requests",
          localField: "friends_list._id",
          foreignField: "requester_id",
          as: "friend_requests",
        },
      },
      {
        $lookup: {
          from: "geolocations",
          localField: "friends_list._id",
          foreignField: "user_id",
          as: "geolocations",
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          // geolocations: 1,
          friends_list: {
            $map: {
              input: "$friends_list",
              as: "friend",
              in: {
                $mergeObjects: [
                  {
                    friend_id: "$$friend._id",
                    user_data: "$$friend.user_data.user",
                  },
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$friend_requests",
                          as: "request",
                          cond: {
                            $eq: ["$$friend._id", "$$request.requester_id"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$geolocations",
                          as: "geolocation",
                          cond: {
                            $eq: ["$$friend._id", "$$geolocation.user_id"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },

      // {
      //   $project: {
      //     _id: 1,
      //     user_id: 1,
      //     geolocation: 1,
      //     friends_list: {
      //       $map: {
      //         input: "$friends_list",
      //         as: "friend",
      //         in: {
      //           $mergeObjects: [
      //             {
      //               friend_id: "$$friend._id",
      //               user_data: "$$friend.user_data.user",
      //             },
      //             {
      //               $arrayElemAt: [
      //                 {
      //                   $filter: {
      //                     input: "$friend_requests",
      //                     as: "request",
      //                     cond: {
      //                       $eq: ["$$friend._id", "$$request.requester_id"],
      //                     },
      //                   },
      //                 },
      //                 0,
      //               ],
      //             },
      //           ],
      //         },
      //       },
      //     },
      //   },
      // },
      // {
      //   $unwind: "$friends_list",
      // },
      // {
      //   $sort: {
      //     "friends_list.approveAt": 1,
      //   },
      // },
      // {
      //   $group: {
      //     _id: "$_id",
      //     user_id: { $first: "$user_id" },
      //     friends_list: { $push: "$friends_list" },
      //   },
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     user_id: 1,
      //     count: { $size: "$friends_list" },
      //     friends_list: 1,
      //   },
      // },
    ]);

    res.status(200).json({
      result: true,
      msg: "Success",
      data: lookupFriendsList,
    });
  } catch (error) {
    next(error);
  }
};
