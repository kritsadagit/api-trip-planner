import { RequestHandler } from "express";
import mongoose from "mongoose";
import GeolocationModel from "../../models/geolocation/geolocation";
import { getUTC7Isodate } from "../../util/utils";

interface GeolocationParam {
  user_id: mongoose.Types.ObjectId;
}

interface GeolocationRequestBody {
  user_id: mongoose.Types.ObjectId;
  lat: string;
  lon: string;
}

export const getGeolocation: RequestHandler<
  GeolocationParam,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    let { user_id } = req.params;

    if (!mongoose.isValidObjectId(user_id)) {
      return res.status(400).json({
        result: false,
        msg: "Bad Request",
      });
    }

    user_id = new mongoose.Types.ObjectId(user_id);

    const geolocation = await GeolocationModel.findOne({
      user_id,
    }).exec();

    res.status(200).json({
      result: true,
      msg: "Success",
      data: geolocation,
    });
  } catch (error) {
    next(error);
  }
};

export const createGeolocation: RequestHandler<
  unknown,
  unknown,
  GeolocationRequestBody,
  unknown
> = async (req, res, next) => {
  try {
    const { user_id, lat, lon } = req.body;

    if (!mongoose.isValidObjectId(user_id) || !lat || !lon) {
      return res.status(400).json({
        result: false,
        msg: "Bad Request",
      });
    }

    const geolocation = await GeolocationModel.findOne({
      user_id,
    }).exec();

    if (!geolocation) {
      const createGeolocation = await GeolocationModel.create({
        user_id,
        lat,
        lon,
        updateAt: getUTC7Isodate(),
      });

      res.status(201).json({
        result: true,
        msg: "Created Geolocation",
        data: createGeolocation,
      });
    } else {
      const newGeolocation = await GeolocationModel.findOneAndUpdate(
        { user_id },
        { lat, lon, updateAt: getUTC7Isodate() },
        { new: true }
      ).exec();

      res.status(200).json({
        result: true,
        msg: "Update Geolocation",
        data: newGeolocation,
      });
    }
  } catch (error) {
    next(error);
  }
};
