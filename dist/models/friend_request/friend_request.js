"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const friendRequestSchema = new mongoose_2.Schema({
    requester_id: { type: mongoose_1.default.Types.ObjectId, required: true },
    receiver_id: { type: mongoose_1.default.Types.ObjectId, required: true },
    status_request: { type: Number, enum: [0, 1], required: true },
    createAt: { type: String },
    approveAt: { type: String },
}, {
    timestamps: false,
    versionKey: false,
});
exports.default = (0, mongoose_2.model)("friend_request", friendRequestSchema);
//# sourceMappingURL=friend_request.js.map