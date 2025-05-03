import jwt from 'jsonwebtoken';
import AppError from '../errors';
import { Types } from 'mongoose';
import { Response } from 'express';

type AccessToken = { access: Types.ObjectId };
type RefreshToken = {
  access: Types.ObjectId;
  refresh: string;
};

type JWTPayload = AccessToken | RefreshToken;

type CookiesParams = { res: Response; access: Types.ObjectId; refresh: string };

export const logoutCookies = (res: Response) => {
  // Send empty cookies to logout user.
  res.cookie('lto_acc', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1,
  });
  res.cookie('lto_ref', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1,
  });
};

export const createJWT = (payload: JWTPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};

export const verifyJWT = (token: string, res: Response) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    logoutCookies(res);
    throw new AppError.Unauthenticated(
      'Authentication failed due to invalid credentials.'
    );
  }
};

const sendCookies = ({ res, access, refresh }: CookiesParams) => {
  // Generates both access and refresh token
  const accessToken = createJWT({ access });
  const refreshToken = createJWT({ access, refresh });

  //   Send access token
  res.cookie('lto_acc', accessToken, {
    httpOnly: true,
    signed: true,
    maxAge: Number(process.env.ACCESS_COOKIE_EXPIRES) * 60 * 60 * 1000, //
    secure: process.env.NODE_ENV === 'production', // Ensure the cookie is only sent over HTTPS
  });

  //   Send the refresh token
  res.cookie('lto_ref', refreshToken, {
    httpOnly: true,
    signed: true,
    maxAge: Number(process.env.REFRESH_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production', // Ensure the cookie is only sent over HTTPS
  });
};

export default sendCookies;
