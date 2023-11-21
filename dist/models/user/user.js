"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    user_data: { type: Object, required: true },
    createAt: { type: String },
    updateAt: { type: String },
}, {
    timestamps: false,
    versionKey: false,
});
exports.default = (0, mongoose_1.model)("user", userSchema);
//# sourceMappingURL=user.js.map