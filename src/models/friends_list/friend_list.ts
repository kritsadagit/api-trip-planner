import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const friendsListSchema = new Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, required: true },
    friends_list: {
      type: Array<mongoose.Types.ObjectId>,
      required: true,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

type FriendsList = InferSchemaType<typeof friendsListSchema>;

export default model<FriendsList>("friends_list", friendsListSchema);
