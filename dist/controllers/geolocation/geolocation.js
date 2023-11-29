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
exports.createGeolocation = exports.getGeolocation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const geolocation_1 = __importDefault(require("../../models/geolocation/geolocation"));
const utils_1 = require("../../util/utils");
const getGeolocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { user_id } = req.params;
        if (!mongoose_1.default.isValidObjectId(user_id)) {
            return res.status(400).json({
                result: false,
                msg: "Bad Request",
            });
        }
        user_id = new mongoose_1.default.Types.ObjectId(user_id);
        const geolocation = yield geolocation_1.default.findOne({
            user_id,
        }).exec();
        res.status(200).json({
            result: true,
            msg: "Success",
            data: geolocation,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getGeolocation = getGeolocation;
const createGeolocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, lat, lon } = req.body;
        if (!mongoose_1.default.isValidObjectId(user_id) || !lat || !lon) {
            return res.status(400).json({
                result: false,
                msg: "Bad Request",
            });
        }
        const geolocation = yield geolocation_1.default.findOne({
            user_id,
        }).exec();
        if (!geolocation) {
            const createGeolocation = yield geolocation_1.default.create({
                user_id,
                lat,
                lon,
                updateAt: (0, utils_1.getUTC7Isodate)(),
            });
            res.status(201).json({
                result: true,
                msg: "Created Geolocation",
                data: createGeolocation,
            });
        }
        else {
            const newGeolocation = yield geolocation_1.default.findOneAndUpdate({ user_id }, { lat, lon, updateAt: (0, utils_1.getUTC7Isodate)() }, { new: true }).exec();
            res.status(200).json({
                result: true,
                msg: "Update Geolocation",
                data: newGeolocation,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createGeolocation = createGeolocation;
//# sourceMappingURL=geolocation.js.map