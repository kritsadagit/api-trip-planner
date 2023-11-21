import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    user_data: { type: Object, required: true },
    createAt: { type: String },
    updateAt: { type: String },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

type User = InferSchemaType<typeof userSchema>;

export default model<User>("user", userSchema);
