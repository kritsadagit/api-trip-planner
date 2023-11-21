import mongoose from "mongoose";
import { InferSchemaType, Schema, model } from "mongoose";

const friendRequestSchema = new Schema(
  {
    requester_id: { type: mongoose.Types.ObjectId, required: true },
    receiver_id: { type: mongoose.Types.ObjectId, required: true },
    status_request: { type: Number, enum: [0, 1], required: true }, //0=requested, 1=approved
    createAt: { type: String },
    approveAt: { type: String },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

type friendRequest = InferSchemaType<typeof friendRequestSchema>;

export default model<friendRequest>("friend_request", friendRequestSchema);
