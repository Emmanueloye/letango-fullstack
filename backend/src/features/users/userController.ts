import User from './userModel';
import * as factory from '../../utils/handlerFactory';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../errors';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import * as utils from '../../utils';
import statusCodes from '../../errors/statusCodes';

export const uploadUserPhoto = utils.upload.single('photo');

export const getUsers = factory.getAll({ Model: User, label: 'users' });

export const getUser = factory.getOne({
  Model: User,
  label: 'user',
  queryKey: 'userRef',
});

export const getMe = factory.getOne({
  Model: User,
  label: 'user',
  queryKey: 'userRef',
});

export const updateMe = factory.updateOne({
  Model: User,
  label: 'user',
  queryKey: 'userRef',
  includedFields: ['surname', 'otherNames', 'phone', 'photo', 'photoPublicId'],
});

export const updateUser = factory.updateOne({
  Model: User,
  label: 'user',
  queryKey: 'userRef',
  includedFields: ['surname', 'otherNames', 'phone', 'status'],
});

export const updateUserPassword = async (req: Request, res: Response) => {
  // Extract the incoming details from the request body
  const { currentPassword, password, confirmPassword } = req.body;

  //   Get the currently logged in user
  const user = await User.findById(req.user.id).select('+password');

  //   Check if the current password is correct.
  if (!(await user?.isPasswordCorrect(currentPassword, user.password))) {
    throw new AppError.BadRequest('Incorrect current password.');
  }

  //   Update password details.
  user!.password = password;
  user!.confirmPassword = confirmPassword;
  user!.passwordChangedAt = new Date(Date.now());
  await user!.save();

  //   Log out user
  utils.logoutCookies(res);

  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'Password updated. please login again with your new credentials.',
  });
};

export const setUserId = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) {
    req.params.id = req.user.userRef;
  }
  next();
};

export const processUserImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the current logged in user since to upload image require user to login. At this point, user will have been on request object.
  const currentUser = await User.findOne({ userRef: req.user.userRef });

  //   If no file on request, then break out of the middleware.
  if (!req.file) return next();

  //   Process the image with sharp. Convert to buffer and to be changed to uri later in the code. The reason being that some free version of servers don't provide file storage.

  const newFile = await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat('jpeg')
    .toBuffer();

  // If user already have image, then we want to delete
  if (currentUser?.photoPublicId) {
    await cloudinary.uploader.destroy(currentUser.photoPublicId);
  }

  //   Convert the processed image from buffer to uri
  const file = utils.formatImageURI('jpeg', newFile);

  //   Upload file to cloudinary
  const result = await cloudinary.uploader.upload(file as string);

  //   Set the cloudinary url and the public image id on the request object.
  req.body.photo = result.secure_url;
  req.body.photoPublicId = result.public_id;

  //   Move on to the next middleware.
  next();
};
