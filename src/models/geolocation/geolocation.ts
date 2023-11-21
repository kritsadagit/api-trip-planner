import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const geolocationSchema = new Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    updateAt: { type: String, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

type Geolocation = InferSchemaType<typeof geolocationSchema>;

export default model<Geolocation>("geolocation", geolocationSchema);
