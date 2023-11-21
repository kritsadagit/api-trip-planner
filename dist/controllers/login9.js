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
exports.onLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user9_1 = __importDefault(require("../models/user9"));
const http_errors_1 = __importDefault(require("http-errors"));
const utils_1 = require("../util/utils");
const validateEnv_1 = __importDefault(require("../util/validateEnv"));
const tokenGenerate = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, validateEnv_1.default.TOKEN_SECRET);
    return token;
};
// export const TokenValidate: RequestHandler = (req, res, next) => {
//   try {
//     if (!req.headers["authorization"])
//       throw createHttpError(401, "Unauthorized");
//     const access_token = req.headers["authorization"].replace("Bearer ", "");
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     jwt.verify(access_token, env.TOKEN_SECRET, (err, decoded) => {
//       if (err) throw createHttpError(403, "Forbidden Access");
//     });
//     next();
//   } catch (error) {
//     throw createHttpError(401, "Unauthorized");
//   }
// };
const onLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!req.headers["authorization"])
        throw (0, http_errors_1.default)(401, "Unauthorized");
    try {
        if (!username) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        if (!password) {
            throw (0, http_errors_1.default)(400, "Password is require");
        }
        const existingUser = yield user9_1.default.findOne({ username: username }).exec();
        if (existingUser) {
            const isValidatedPassword = yield (0, utils_1.compareHash)(existingUser.password, password);
            if (isValidatedPassword) {
                res.status(200).json({
                    result: true,
                    token: tokenGenerate({ username, password }),
                    msg: "Success",
                });
            }
            else {
                res.status(403).json({
                    result: false,
                    msg: "Forbidden access",
                });
            }
        }
        else {
            res.status(403).json({
                result: false,
                msg: "Forbidden access",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.onLogin = onLogin;
//# sourceMappingURL=login9.js.map