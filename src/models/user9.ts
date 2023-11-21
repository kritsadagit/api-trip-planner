import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    createAt: { type: String },
    updateAt: { type: String },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

type User = InferSchemaType<typeof userSchema>;

export default model<User>("Users", userSchema);
