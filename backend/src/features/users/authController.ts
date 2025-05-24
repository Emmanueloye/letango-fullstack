import { NextFunction, Request, Response } from 'express';
import User from './userModel';
import Token from './tokenModel';
import * as utils from '../../utils';
import AppError from '../../errors';
import statusCodes from '../../errors/statusCodes';

export const createUser = async (req: Request, res: Response) => {
  // Extract registration data from the request body.
  const { surname, otherNames, email, password, confirmPassword } = req.body;
  // Generate token and hashedToken. Saved hashed token in db and send plain to user.
  const [token, hashedToken] = utils.generateToken({});

  // Create new user
  const newUser = await User.create({
    userRef: utils.generateUniqueId(8).toUpperCase(),
    surname,
    otherNames,
    email,
    password,
    confirmPassword,
    emailVerificationToken: hashedToken,
  });

  // set email verification data
  const data = {
    name: otherNames.split(' ')[0],
    url: `${process.env.BASE_URL}/verify-email?email=${email}&token=${token}`,
    email,
  };

  // Send verification email using the email class
  try {
    await utils.Email.sendVerificationEmail(data);
    res.status(statusCodes.CREATED).json({
      status: 'success',
      message: 'Please check your email for your verification email.',
      url: data.url,
    });
  } catch (error) {
    await User.deleteOne({ _id: newUser._id });
    throw new AppError.InternalError(
      'Sorry! Something went wrong and we could not send your verification email. Please try and register again.'
    );
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  // Get email and the verification token from the body
  const { email, token } = req.body;

  // Get user with email and verification token from DB
  const user = await User.findOne({
    email,
    emailVerificationToken: utils.generateToken({ type: 'hash', token }),
  });

  // If no user, throw an error.
  if (!user) {
    throw new AppError.BadRequest(
      'Invalid verification credentials. Please follow the verification link sent to your email.'
    );
  }

  // Otherwise, update user verification details
  user.emailVerificationToken = undefined;
  user.isVerified = true;
  user.verificationDate = new Date(Date.now());
  await user.save();

  // Send back response to users.
  res.status(statusCodes.OK).json({
    status: 'success',
    message:
      'Thank you for verifying your email. Please log in to your account.',
  });
};

export const login = async (req: Request, res: Response) => {
  // Get the email and password from request body.
  const { email, password } = req.body;
  // Get the user with the incoming email.
  const user = await User.findOne({ email }).select('+password');
  // Check if the user exist and also if the password provided is correct.
  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    throw new AppError.Unauthenticated('Invalid email or password.');
  }
  // Check if the user is verified.
  if (!user.isVerified) {
    throw new AppError.Unauthenticated(
      'Please verify your email to login to the application.'
    );
  }

  // Check if user is not suspended or banned
  if (user.status !== 'active') {
    throw new AppError.UnAuthorized(
      'Your account has been suspended or banned. Please contact the page admin.'
    );
  }

  // If the user is already logged in and the user refreshtoken is set to invalid, then the user wont be able to login to the application.
  const existingRefreshToken = await Token.findOne({ userId: user._id });
  if (existingRefreshToken && !existingRefreshToken.isValid) {
    throw new AppError.UnAuthorized(
      'Sorry! You are not authorized to use this app. Please contact the admin.'
    );
  }
  // Set email data
  // Generate the OTP, loginToken and redirect url for user.
  const otp = utils.generateUniqueId(6);
  const [plainLoginToken, hashedLoginToken] = utils.generateToken({});
  const redirectURL = `/login/otp?email=${email}&token=${plainLoginToken}`;

  const data = {
    otp,
    email,
    name: user.otherNames.split(' ').at(0),
  };

  // save updates on user database.
  user.loginOTP = utils.generateToken({ type: 'hash', token: otp }) as string;
  user.loginOTPExpiresAt = new Date(
    Date.now() + Number(process.env.OTP_EXPIRES_AT) * 60 * 1000
  );
  user.loginToken = hashedLoginToken;
  await user.save();
  // send OTP email to users.
  try {
    await utils.Email.sendOTPEmail(data);
    res.status(statusCodes.OK).json({
      status: 'success',
      message: 'Please check your email for your one-time login code.',
      redirectURL,
    });
  } catch (error) {
    // unset the login details and throw error.
    user.loginOTP = undefined;
    user.loginOTPExpiresAt = undefined;
    user.loginToken = undefined;
    await user.save();
    throw new AppError.NotFound(
      'Sorry, we could not send your one-time login code at the moment. Please try again later.'
    );
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  //Get otp verification data from request boday
  const { email, token, loginOTP } = req.body;
  // Get user with the credentials and with loginOTP that is yet to expire
  const user = await User.findOne({
    email,
    loginOTP: utils.generateToken({ type: 'hash', token: loginOTP }),
    loginToken: utils.generateToken({ type: 'hash', token }),
    loginOTPExpiresAt: { $gt: Date.now() },
  });

  // If no user, then throw error
  if (!user) {
    throw new AppError.Unauthenticated(
      'Invalid one-time password. Please try logging in again.'
    );
  }

  // otherwise, unset all login details that was set during the initial login stage.
  user.loginOTP = undefined;
  user.loginOTPExpiresAt = undefined;
  user.loginToken = undefined;
  await user.save();

  // Check if we have an existing refresh token in the tokens collection using the user.
  const existingToken = await Token.findOne({ userId: user._id });

  // If refresh token exist
  if (existingToken) {
    if (!existingToken.isValid) {
      throw new AppError.UnAuthorized(
        'Sorry! You are not authorized to use this app. Please contact the admin.'
      );
    }
    // Send cookies using the existing token
    utils.sendCookies({
      res,
      access: user._id,
      refresh: existingToken.refreshToken,
    });
    res
      .status(statusCodes.OK)
      .json({ status: 'success', message: 'You are now logged in.' });

    return;
  }

  // if no existing refresh token, we create new one, send cookies and respond.
  const newToken = await Token.create({
    refreshToken: utils.generateToken({ type: 'plain' }),
    userId: user._id,
    userIp: req.ip,
    userAgent: req.header('user-agent'),
  });

  utils.sendCookies({
    res,
    access: user._id,
    refresh: newToken.refreshToken,
  });

  res
    .status(statusCodes.OK)
    .json({ status: 'success', message: 'You are now logged in.' });
};

export const forgetPassword = async (req: Request, res: Response) => {
  // get the incoming email
  const { email } = req.body;
  // get user with the email
  const user = await User.findOne({ email });

  // if there is user, set password reset data
  if (user) {
    // Generate tokens
    const [token, hashedToken] = utils.generateToken({});
    // Set password reset data in database
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(
      Date.now() + Number(process.env.OTP_EXPIRES_AT) * 60 * 1000
    );
    await user.save();

    // Send reset link to user
    const url = `${process.env.BASE_URL}/reset-password?email=${email}&token=${token}`;

    try {
      // Set email data
      const data = {
        name: user.otherNames.split(' ').at(0),
        url,
        email,
      };

      await utils.Email.sendResetPasswordLink(data);
    } catch (error) {
      // if there is an error, unset the password  reset data in database
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      // Throw an error
      throw new AppError.InternalError(
        'Sorry, Something went wrong and we could not send your reset link at the moment. Please try again later.'
      );
    }
  }

  //otherwise Send sames success message to user whether it is successful or not.
  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'Please check your email for your password reset link.',
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  // Get incoming data from request body.
  const { email, token, password, confirmPassword } = req.body;

  // Get user with the incoming reset password credentials.
  const user = await User.findOne({
    email,
    passwordResetToken: utils.generateToken({ type: 'hash', token }),
    passwordResetExpires: { $gt: Date.now() },
  });

  // If no user, it's either data is not correct or reset token has expires.
  if (!user) {
    throw new AppError.BadRequest(
      'Password reset failed due to invalid reset credentials. Please follow the reset link sent to your email or start the process again.'
    );
  }

  // Otherwise, unset token and reset the password.
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordChangedAt = new Date(Date.now() - 1000);
  await user.save();

  // Respond to user
  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'Password reset successfully. Login with your new credentials.',
  });
};

// To be updated later
export const logout = async (req: Request, res: Response) => {
  // Delete token model
  await Token.findOneAndDelete({ userId: req.user.id });

  // Send empty cookies to logout user.
  utils.logoutCookies(res);

  res.status(statusCodes.OK).json({ status: 'success' });
};

//In case the details is set on query paramter, this middleware switch the email and token from the query parameters to the request body
export const switchVerificationData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) req.body.email = req.query.email;
  if (!req.body.token) req.body.token = req.query.token;
  next();
};
