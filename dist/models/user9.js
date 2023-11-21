"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    createAt: { type: String },
    updateAt: { type: String },
}, {
    timestamps: false,
    versionKey: false,
});
exports.default = (0, mongoose_1.model)("Users", userSchema);
//# sourceMappingURL=user9.js.map