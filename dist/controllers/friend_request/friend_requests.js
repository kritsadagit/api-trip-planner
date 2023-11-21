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
exports.cancelFriendRequest = exports.updateApproveFriendRequest = exports.createFriendRequest = exports.sendingRequests = exports.getFriendRequests = void 0;
const friend_request_1 = __importDefault(require("../../models/friend_request/friend_request"));
const friend_list_1 = __importDefault(require("../../models/friends_list/friend_list"));
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../../util/utils");
const getFriendRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let receiver_id = req.query.receiver_id;
    try {
        if (!mongoose_1.default.isValidObjectId(receiver_id)) {
            return res.status(400).json({
                result: false,
                msg: "Invalid receiver id",
            });
        }
        receiver_id = new mongoose_1.default.Types.ObjectId(receiver_id);
        if (!receiver_id) {
            return res.status(400).json({
                result: false,
                msg: "Bad Request",
            });
        }
        const lookupFriendRequestUser = yield friend_request_1.default.aggregate([
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
    }
    catch (error) {
        next(error);
    }
});
exports.getFriendRequests = getFriendRequests;
const sendingRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let requester_id = req.query.requester_id;
    console.log("requester_id: ", requester_id);
    try {
        if (!mongoose_1.default.isValidObjectId(requester_id)) {
            return res.status(400).json({
                result: false,
                msg: "Invalid requester_id id",
            });
        }
        requester_id = new mongoose_1.default.Types.ObjectId(requester_id);
        if (!requester_id) {
            return res.status(400).json({
                result: false,
                msg: "Bad Request",
            });
        }
        const lookupSendingRequestUser = yield friend_request_1.default.aggregate([
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
    }
    catch (error) {
        next(error);
    }
});
exports.sendingRequests = sendingRequests;
const createFriendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { requester_id, receiver_id } = req.body;
    const status_request = req.body.status_request;
    try {
        if (!mongoose_1.default.isValidObjectId(requester_id) ||
            !mongoose_1.default.isValidObjectId(receiver_id)) {
            return res.status(400).json({
                result: false,
                msg: "Invalid object id",
            });
        }
        requester_id = new mongoose_1.default.Types.ObjectId(requester_id);
        receiver_id = new mongoose_1.default.Types.ObjectId(receiver_id);
        const friendRequest = yield friend_request_1.default.findOne({
            requester_id,
            receiver_id,
        }).exec();
        const friendSending = yield friend_request_1.default.findOne({
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
        const newFriendRequest = yield friend_request_1.default.create({
            requester_id,
            receiver_id,
            status_request: 0,
            createAt: (0, utils_1.getUTC7Isodate)(),
        });
        res.status(201).json({
            result: true,
            msg: "Created request",
            data: newFriendRequest,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createFriendRequest = createFriendRequest;
const updateApproveFriendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { requester_id, receiver_id } = req.body;
    try {
        requester_id = new mongoose_1.default.Types.ObjectId(requester_id);
        receiver_id = new mongoose_1.default.Types.ObjectId(receiver_id);
        if (!mongoose_1.default.isValidObjectId(requester_id) ||
            !mongoose_1.default.isValidObjectId(receiver_id)) {
            return res.status(400).json({
                result: false,
                msg: "Invalid object id",
            });
        }
        const friendRequest = yield friend_request_1.default.findOne({
            requester_id,
            receiver_id,
        }).exec();
        if (!friendRequest) {
            return res.status(404).json({
                result: false,
                msg: "Request not found",
            });
        }
        yield friend_request_1.default.findOneAndUpdate({
            requester_id,
            receiver_id,
        }, { status_request: 1, approveAt: (0, utils_1.getUTC7Isodate)() }, { new: true }).exec();
        // res.status(204).send();
        const friendsList = yield friend_list_1.default.findOne({
            user_id: receiver_id,
        }).exec();
        if (!friendsList) {
            const newFriendsList = yield friend_list_1.default.create({
                user_id: receiver_id,
                friends_list: requester_id,
            });
            res.status(201).json({
                result: true,
                msg: "Created friend list",
                data: newFriendsList,
            });
        }
        else {
            const updateFriendsList = yield friend_list_1.default.findOneAndUpdate({
                user_id: receiver_id,
            }, {
                $addToSet: {
                    friends_list: requester_id,
                },
            }, { new: true }).exec();
            res.status(200).json({
                result: true,
                msg: "Updated friend list",
                data: updateFriendsList,
            });
        }
        const reverseFriendsList = yield friend_list_1.default.findOne({
            user_id: requester_id,
        }).exec();
        if (!reverseFriendsList) {
            yield friend_list_1.default.create({
                user_id: requester_id,
                friends_list: receiver_id,
            });
        }
        else {
            yield friend_list_1.default.findOneAndUpdate({ user_id: requester_id }, { $addToSet: { friends_list: receiver_id } }, { new: true }).exec();
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateApproveFriendRequest = updateApproveFriendRequest;
const cancelFriendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { friend_request_id } = req.params;
    try {
        if (!mongoose_1.default.isValidObjectId(friend_request_id)) {
            return res.status(400).json({
                result: false,
                msg: "Bad request",
            });
        }
        const friendRequest = yield friend_request_1.default.findOneAndDelete({ _id: friend_request_id, status_request: 0 }, { new: true }).exec();
        if (!friendRequest) {
            return res.status(404).json({
                result: false,
                msg: "Request id not found to delete",
            });
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.cancelFriendRequest = cancelFriendRequest;
//# sourceMappingURL=friend_requests.js.map