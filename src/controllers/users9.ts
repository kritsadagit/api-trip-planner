import { RequestHandler } from "express";
import UserModel from "../models/user9";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { getUTC7Isodate, hashPassword } from "../util/utils";

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await UserModel.find().exec();
    res.status(200).json({
      result: true,
      data: users,
      msg: "Success",
    });
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }

    const user = await UserModel.findById(userId).exec();
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json({
      result: true,
      data: user,
      msg: "Success",
    });
  } catch (error) {
    next(error);
  }
};

interface createUserBody {
  username?: string;
  password?: string;
}

export const createUser: RequestHandler<
  unknown,
  unknown,
  createUserBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    if (!username) {
      throw createHttpError(400, "User must have a username");
    }

    if (!password) {
      throw createHttpError(400, "User must have a password");
    }

    const existingUser = await UserModel.findOne({ username }).exec();

    if (!existingUser) {
      const hashedPassword = await hashPassword(password);
      const newUser = await UserModel.create({
        username: username,
        password: hashedPassword,
        createAt: getUTC7Isodate(),
      });

      res.status(201).json({
        result: true,
        data: newUser,
        msg: "Success",
      });
    } else throw createHttpError(409, "Username already exists");
  } catch (error) {
    next(error);
  }
};

interface UpdateUserParams {
  userId?: string;
}

interface UpdateUserBody {
  password?: string;
  newPassword?: string;
}

export const updateUser: RequestHandler<
  UpdateUserParams,
  unknown,
  UpdateUserBody,
  unknown
> = async (req, res, next) => {
  const userId = req.params.userId;
  const password = req.body.password;
  const newPassword = req.body.newPassword;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "invalid user id");
    }

    const user = await UserModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (!password) {
      throw createHttpError(400, "Password is require");
    }

    if (!newPassword) {
      throw createHttpError(400, "New password is require");
    }

    if (password === user.password) {
      if (user.password !== newPassword) {
        user.password = newPassword;
        user.updateAt = getUTC7Isodate();

        const updateUser = await user.save();
        res.status(200).json(updateUser);
      } else {
        throw createHttpError(
          401,
          "New password must be different from the old password"
        );
      }
    } else {
      throw createHttpError(401, "Wrong password");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user id");
    }

    const user = await UserModel.findById(userId).exec();

    if (!user) {
      throw createHttpError("User not found");
    }
    await user.deleteOne();
    res.json({
      result: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
