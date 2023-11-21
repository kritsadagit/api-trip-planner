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
exports.getOauthToken = exports.accessTokenValidate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = __importDefault(require("../util/validateEnv"));
const http_errors_1 = __importDefault(require("http-errors"));
const accessTokenGenerate = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, validateEnv_1.default.ACCESS_TOKEN_SECRET);
    return accessToken;
};
const accessTokenValidate = (req, res, next) => {
    try {
        if (!req.headers["authorization"])
            throw (0, http_errors_1.default)(401, "Unauthorized");
        const token = req.headers["authorization"].replace("Bearer ", "");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jsonwebtoken_1.default.verify(token, validateEnv_1.default.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err)
                throw (0, http_errors_1.default)(403, "Forbidden Access");
        });
        // console.log("token: ", token);
        next();
    }
    catch (error) {
        throw (0, http_errors_1.default)(401, "Unauthorized");
    }
};
exports.accessTokenValidate = accessTokenValidate;
const getOauthToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { grant_type, client_id, client_secret } = req.body;
    const payload = {
        grant_type,
        client_id,
        client_secret,
    };
    console.log("grant_type: ", grant_type);
    try {
        res.status(200).json({
            result: true,
            access_token: accessTokenGenerate(payload),
            msg: "Success",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getOauthToken = getOauthToken;
//# sourceMappingURL=oauth.js.map