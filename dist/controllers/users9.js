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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const user9_1 = __importDefault(require("../models/user9"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../util/utils");
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user9_1.default.find().exec();
        res.status(200).json({
            result: true,
            data: users,
            msg: "Success",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        if (!mongoose_1.default.isValidObjectId(userId)) {
            throw (0, http_errors_1.default)(400, "Invalid user id");
        }
        const user = yield user9_1.default.findById(userId).exec();
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        res.status(200).json({
            result: true,
            data: user,
            msg: "Success",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username) {
            throw (0, http_errors_1.default)(400, "User must have a username");
        }
        if (!password) {
            throw (0, http_errors_1.default)(400, "User must have a password");
        }
        const existingUser = yield user9_1.default.findOne({ username }).exec();
        if (!existingUser) {
            const hashedPassword = yield (0, utils_1.hashPassword)(password);
            const newUser = yield user9_1.default.create({
                username: username,
                password: hashedPassword,
                createAt: (0, utils_1.getUTC7Isodate)(),
            });
            res.status(201).json({
                result: true,
                data: newUser,
                msg: "Success",
            });
        }
        else
            throw (0, http_errors_1.default)(409, "Username already exists");
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    try {
        if (!mongoose_1.default.isValidObjectId(userId)) {
            throw (0, http_errors_1.default)(400, "invalid user id");
        }
        const user = yield user9_1.default.findById(userId).exec();
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        if (!password) {
            throw (0, http_errors_1.default)(400, "Password is require");
        }
        if (!newPassword) {
            throw (0, http_errors_1.default)(400, "New password is require");
        }
        if (password === user.password) {
            if (user.password !== newPassword) {
                user.password = newPassword;
                user.updateAt = (0, utils_1.getUTC7Isodate)();
                const updateUser = yield user.save();
                res.status(200).json(updateUser);
            }
            else {
                throw (0, http_errors_1.default)(401, "New password must be different from the old password");
            }
        }
        else {
            throw (0, http_errors_1.default)(401, "Wrong password");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        if (!mongoose_1.default.isValidObjectId(userId)) {
            throw (0, http_errors_1.default)(400, "Invalid user id");
        }
        const user = yield user9_1.default.findById(userId).exec();
        if (!user) {
            throw (0, http_errors_1.default)("User not found");
        }
        yield user.deleteOne();
        res.json({
            result: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=users9.js.map