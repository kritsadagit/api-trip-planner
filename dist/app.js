"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const http_errors_1 = __importStar(require("http-errors"));
const body_parser_1 = __importDefault(require("body-parser"));
const oauth_1 = __importDefault(require("./routes/oauth"));
const users_1 = __importDefault(require("./routes/user/users"));
const friend_requests_1 = __importDefault(require("./routes/friend_requests/friend_requests"));
const friends_list_1 = __importDefault(require("./routes/friends_list/friends_list"));
const geolocation_1 = __importDefault(require("./routes/geolocation/geolocation"));
const oauth_2 = require("./controllers/oauth");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.use("/api/oauth", oauth_1.default);
app.use("/api/users", oauth_2.accessTokenValidate, users_1.default);
app.use("/api/friend_requests", oauth_2.accessTokenValidate, friend_requests_1.default);
app.use("/api/friends_list", oauth_2.accessTokenValidate, friends_list_1.default);
app.use("/api/geolocation", oauth_2.accessTokenValidate, geolocation_1.default);
app.use((req, res, next) => {
    // next(Error("Endpoint not found"));
    next((0, http_errors_1.default)(404, "Endpoint not found"));
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, next) => {
    // console.log("isHttpError(error): ", isHttpError(error));
    // let errorMessage = "An unknown error occured";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const errorMessage = error.message;
    let statusCode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        // errorMessage = error.message;
    }
    res.status(statusCode).json({
        result: false,
        error: errorMessage,
        msg: errorMessage,
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map