/// <reference path='../../types/express.d.ts'/>
import { NextFunction, Request, Response } from 'express';
import User from '../features/users/userModel';
import Token from '../features/users/tokenModel';
import AppError from '../errors';
import * as utils from '../utils';
import { Types } from 'mongoose';

type AccessType = { access: string; iat: number };
type RefreshType = { access: string; refresh: string; iat: number };

/**
 * This function run checks and ensure that all key conditions are checked before authorizing user.
 * @param currentUser current user query
 * @param existingRefreshToken existing token query
 * @param iat jwt issued time
 */
const checkAuth = (
  currentUser: any,
  existingRefreshToken: any,
  iat: number
) => {
  if (!currentUser) {
    throw new AppError.NotFound(
      'Sorry, user with this credentials does not exist.'
    );
  }

  if (currentUser.status !== 'active') {
    throw new AppError.UnAuthorized(
      'Your account has been suspended or banned. Please contact the page admin.'
    );
  }

  if (existingRefreshToken && !existingRefreshToken.isValid) {
    throw new AppError.UnAuthorized(
      'Sorry! You are not authorized to use this app. Please contact the admin.'
    );
  }

  if (currentUser.detectPasswordChange(iat)) {
    throw new AppError.Unauthenticated(
      'Password change is detected. Please login again.'
    );
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the signed cookies from the request.
  const { lto_acc: accessToken, lto_ref: refreshToken } = req.signedCookies;

  // If there is access token
  if (accessToken) {
    // decode the access token.
    const decode = utils.verifyJWT(accessToken, res);
    const { access: userId, iat } = decode as AccessType;

    // Get current logged in user from the user collection
    const currentUser = await User.findById(userId);

    // Get existing refresh token from token collection.
    const existingRefreshToken = await Token.findOne({ userId });

    // Run checks
    checkAuth(currentUser, existingRefreshToken, iat);

    // send both refresh and access token to user again.
    utils.sendCookies({
      res,
      access: new Types.ObjectId(userId),
      refresh: existingRefreshToken!.refreshToken,
    });

    // Assign current user to req.user.
    req.user = currentUser;

    return next();
  }

  const decode = utils.verifyJWT(refreshToken, res);
  const { access: userId, refresh, iat } = decode as RefreshType;

  const currentUser = await User.findById(userId);
  const existingRefreshToken = await Token.findOne({ userId });

  checkAuth(currentUser, existingRefreshToken, iat);

  utils.sendCookies({
    res,
    access: new Types.ObjectId(userId),
    refresh,
  });

  req.user = currentUser;

  next();
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError.UnAuthorized(
        'Oop! The resource you are looking for is not available on our server.'
      );
    }
    next();
  };
};
