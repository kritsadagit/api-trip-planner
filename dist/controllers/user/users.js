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
exports.createUser = exports.getUser = exports.getUsers = void 0;
const user_1 = __importDefault(require("../../models/user/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../../util/utils");
const http_errors_1 = __importDefault(require("http-errors"));
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find().exec();
        res.status(200).json({
            result: true,
            msg: "Success",
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        if (!mongoose_1.default.isValidObjectId(userId)) {
            return res.status(400).json({
                result: false,
                msg: "Invalid user id",
            });
        }
        const user = yield user_1.default.findById(userId).exec();
        if (!user) {
            return res.status(404).json({
                result: false,
                msg: "User not found",
            });
        }
        res.status(200).json({
            result: true,
            msg: "Success",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_data } = req.body;
    try {
        if (!user_data) {
            throw (0, http_errors_1.default)(400, "Path require user_data");
        }
        const existingUser = yield user_1.default.findOne({
            "user_data.user.id": user_data.user.id,
        }).exec();
        if (!existingUser) {
            const newUser = yield user_1.default.create({
                user_data,
                createAt: (0, utils_1.getUTC7Isodate)(),
            });
            res.status(201).json({
                result: true,
                msg: "Success",
                data: newUser,
            });
        }
        else {
            const user = yield user_1.default.findById(existingUser._id).exec();
            if (user) {
                user.updateAt = (0, utils_1.getUTC7Isodate)();
                const updateUser = yield user.save();
                res.status(200).json({
                    result: true,
                    msg: "Success",
                    data: updateUser,
                });
            }
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
// export const getGoogleSignInUser: RequestHandler<
//   referenceIdParam,
//   unknown,
//   unknown,
//   unknown
// > = async (req, res, next) => {
//   const requester_id = req.params.requester_id;
//   try {
//     const googleSigninUser = await UserModel.findOne({
//       "user_data.user.id": requester_id,
//     });
//     if (googleSigninUser) {
//       res.status(200).json({
//         result: true,
//         data: googleSigninUser,
//         msg: "Success",
//       });
//     } else {
//       res.status(404).json({
//         result: false,
//         msg: "User Not found",
//       });
//     }
//     console.log("googleSigninUser: ", googleSigninUser);
//   } catch (error) {
//     next(error);
//   }
// };
// export const createGoogleSignInUser: RequestHandler<
//   unknown,
//   unknown,
//   createUser,
//   unknown
// > = async (req, res, next) => {
//   const user_data = req.body.user_data;
//   try {
//     const existingUser = await UserModel.findOne({
//       "user_data.user.id": data.user.id,
//     }).exec();
//     // console.log("existingUser: ", existingUser);
//     if (!existingUser) {
//       const newGoogleSignInUser = await UserModel.create({
//         google_signin_data: google_signin_data,
//         createAt: getUTC7Isodate(),
//       });
//       res.status(201).json({
//         result: true,
//         data: newGoogleSignInUser,
//         msg: "Success",
//       });
//     } else {
//       const google_sign = await UserModel.findById(existingUser._id).exec();
//       if (google_sign) {
//         google_sign.updateAt = getUTC7Isodate();
//         const updateUser = await google_sign.save();
//         res.status(200).json({
//           result: true,
//           data: updateUser,
//           msg: "Success",
//         });
//       } else {
//         res.status(200).json({
//           result: true,
//           data: existingUser,
//           msg: "Success",
//         });
//       }
//     }
//   } catch (error) {
//     next(error);
//   }
// };
//# sourceMappingURL=users.js.map