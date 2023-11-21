import { RequestHandler } from "express";
import UserModel from "../../models/user/user";
import mongoose from "mongoose";
import { getUTC7Isodate } from "../../util/utils";
import createHttpError from "http-errors";
// import { getUTC7Isodate } from "../util/utils";

// interface createUser {
//   user_data: User;
// }

// interface referenceIdParam {
//   requester_id: string;
// }

interface IGetUserParam {
  userId: mongoose.Types.ObjectId;
}

interface IUserData {
  user: {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
    familyName: string | null;
    givenName: string | null;
  };
  scopes?: string[];
  idToken: string | null;
  serverAuthCode: string | null;
}

interface ICreateUserBody {
  user_data: IUserData;
}

export const getUsers: RequestHandler<
  unknown,
  unknown,
  unknown,
  unknown
> = async (req, res, next): Promise<void> => {
  try {
    const users = await UserModel.find().exec();
    res.status(200).json({
      result: true,
      msg: "Success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler<
  IGetUserParam,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid user id",
      });
    }

    const user = await UserModel.findById(userId).exec();

    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler<
  unknown,
  unknown,
  ICreateUserBody,
  unknown
> = async (req, res, next) => {
  const { user_data } = req.body;
  try {
    if (!user_data) {
      throw createHttpError(400, "Path require user_data");
    }

    const existingUser = await UserModel.findOne({
      "user_data.user.id": user_data.user.id,
    }).exec();

    if (!existingUser) {
      const newUser = await UserModel.create({
        user_data,
        createAt: getUTC7Isodate(),
      });

      res.status(201).json({
        result: true,
        msg: "Success",
        data: newUser,
      });
    } else {
      const user = await UserModel.findById(existingUser._id).exec();
      if (user) {
        user.updateAt = getUTC7Isodate();

        const updateUser = await user.save();

        res.status(200).json({
          result: true,
          msg: "Success",
          data: updateUser,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// export const getGoogleSignInUser: RequestHandler<
//   referenceIdParam,
//   unknown,
//   unknown,
//   unknown
// > = async (req, res, next) => {
//   const requester_id = req.params.requester_id;
//   try {
//     const googleSigninUser = await UserModel.findOne({
//       "user_data.user.id": requester_id,
//     });

//     if (googleSigninUser) {
//       res.status(200).json({
//         result: true,
//         data: googleSigninUser,
//         msg: "Success",
//       });
//     } else {
//       res.status(404).json({
//         result: false,
//         msg: "User Not found",
//       });
//     }

//     console.log("googleSigninUser: ", googleSigninUser);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createGoogleSignInUser: RequestHandler<
//   unknown,
//   unknown,
//   createUser,
//   unknown
// > = async (req, res, next) => {
//   const user_data = req.body.user_data;
//   try {
//     const existingUser = await UserModel.findOne({
//       "user_data.user.id": data.user.id,
//     }).exec();
//     // console.log("existingUser: ", existingUser);

//     if (!existingUser) {
//       const newGoogleSignInUser = await UserModel.create({
//         google_signin_data: google_signin_data,
//         createAt: getUTC7Isodate(),
//       });

//       res.status(201).json({
//         result: true,
//         data: newGoogleSignInUser,
//         msg: "Success",
//       });
//     } else {
//       const google_sign = await UserModel.findById(existingUser._id).exec();
//       if (google_sign) {
//         google_sign.updateAt = getUTC7Isodate();

//         const updateUser = await google_sign.save();
//         res.status(200).json({
//           result: true,
//           data: updateUser,
//           msg: "Success",
//         });
//       } else {
//         res.status(200).json({
//           result: true,
//           data: existingUser,
//           msg: "Success",
//         });
//       }
//     }
//   } catch (error) {
//     next(error);
//   }
// };
