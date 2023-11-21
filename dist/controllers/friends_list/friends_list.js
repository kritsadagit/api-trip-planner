"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendsList = void 0;
const friend_list_1 = __importDefault(require("../../models/friends_list/friend_list"));
const mongoose_1 = __importDefault(require("mongoose"));
const getFriendsList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.query.user_id;
    try {
        if (!mongoose_1.default.isValidObjectId(user_id)) {
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
        user_id = new mongoose_1.default.Types.ObjectId(user_id);
        // const lookupFriendsList = await FriendsListModel.aggregate([
        //   {
        //     $match: {
        //       user_id,
        //     },
        //   },
        //   {
        //     $lookup: {
        //       from: "users",
        //       localField: "friends_list",
        //       foreignField: "_id",
        //       as: "friends_list",
        //     },
        //   },
        //   {
        //     $lookup: {
        //       from: "friend_requests",
        //       localField: "friends_list._id",
        //       foreignField: "requester_id",
        //       as: "friend_requests",
        //     },
        //   },
        //   {
        //     $project: {
        //       _id: 1,
        //       user_id: 1,
        //       friends_list: {
        //         $map: {
        //           input: "$friends_list",
        //           as: "friend",
        //           in: {
        //             $mergeObjects: [
        //               {
        //                 friend_id: "$$friend._id",
        //                 user_data: "$$friend.user_data.user",
        //               },
        //               {
        //                 $arrayElemAt: [
        //                   {
        //                     $filter: {
        //                       input: "$friend_requests",
        //                       as: "request",
        //                       cond: {
        //                         $eq: ["$$friend._id", "$$request.requester_id"],
        //                       },
        //                     },
        //                   },
        //                   0,
        //                 ],
        //               },
        //             ],
        //           },
        //         },
        //       },
        //     },
        //   },
        //   {
        //     $unwind: "$friends_list",
        //   },
        //   {
        //     $sort: {
        //       "friends_list.approveAt": -1,
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: "$_id",
        //       user_id: { $first: "$user_id" },
        //       friends_list: { $push: "$friends_list" },
        //     },
        //   },
        //   {
        //     $project: {
        //       _id: 1,
        //       user_id: 1,
        //       count: { $size: "$friends_list" },
        //       friends_list: 1,
        //     },
        //   },
        // ]);
        const lookupFriendsList = yield friend_list_1.default.aggregate([
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
                $project: {
                    _id: 1,
                    user_id: 1,
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
                                ],
                            },
                        },
                    },
                },
            },
            {
                $unwind: "$friends_list",
            },
            {
                $sort: {
                    "friends_list.approveAt": 1,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    user_id: { $first: "$user_id" },
                    friends_list: { $push: "$friends_list" },
                },
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    count: { $size: "$friends_list" },
                    friends_list: 1,
                },
            },
        ]);
        res.status(200).json({
            result: true,
            msg: "Success",
            data: lookupFriendsList,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getFriendsList = getFriendsList;
//# sourceMappingURL=friends_list.js.map