import { NextFunction, Request, Response } from 'express';
import statusCodes from '../errors/statusCodes';
import AppError from '../errors';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Send error during development
 * @param err the error object thrown by the request
 * @param res express response object
 */
const sendDevError = (err: any, res: Response) => {
  res
    .status(err.statusCode || statusCodes.INTERNAL_SERVER_ERROR)
    .json({ err, stack: err.stack });
};

/**
 * Send error during production
 * @param err the error object thrown by the request
 * @param res express response object
 */
const sendProdError = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({ status: err.status, message: err.msg });
  } else {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went very wrong. Please try again later.',
    });
  }
};

const handleValidationError = (err: any) => {
  const msg = Object.values(err.errors)
    .map((val: any) => val.message)
    .join(',');

  return new AppError.BadRequest(msg);
};

// Handles duplication error
const handleDuplicationError = (err: any) => {
  // Get the field that is being duplicated
  const key = Object.keys(err.keyValue).at(0);
  // Capitalized first letter of the field.
  const capitalizedKey = `${key?.charAt(0).toUpperCase()}${key?.slice(1)}`;
  // Return error message
  return new AppError.BadRequest(
    `${capitalizedKey} has been taken. Please choose another value.`
  );
};

/**
 * The middleware handles all application errors. All errors throw within the app goes throught this middleware.
 * @param err the error object thrown by the request
 * @param req express request object
 * @param res express response object
 * @param next express next function
 */
const globalErrorMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };

  if (err.name === 'ValidationError') error = handleValidationError(error);

  if (err.code === 11000) error = handleDuplicationError(err);

  // To delete user photo on cloudinary if the request encounter error.
  if (req.body?.photo) {
    await cloudinary.uploader.destroy(req.body.photoPublicId);
  }
  // sendProdError(error, res);
  sendDevError(err, res);
};

export default globalErrorMiddleware;
