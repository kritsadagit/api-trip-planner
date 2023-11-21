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
exports.compareHash = exports.hashPassword = exports.getUTC7Isodate = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUTC7Isodate = () => {
    return (0, moment_timezone_1.default)().utcOffset(7).toISOString(true);
};
exports.getUTC7Isodate = getUTC7Isodate;
const hashPassword = (password) => {
    const saltRound = 10;
    try {
        const hashedPassword = bcrypt_1.default.hash(password, saltRound);
        return hashedPassword;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
exports.hashPassword = hashPassword;
const compareHash = (hashedPassword, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isValidate = bcrypt_1.default.compare(password, hashedPassword);
    return isValidate;
});
exports.compareHash = compareHash;
//# sourceMappingURL=utils.js.map