import rateLimit from 'express-rate-limit';
import AppError from '../errors';
import statusCodes from '../errors/statusCodes';

export const loginRateLimiter = rateLimit({
  windowMs: Number(process.env.LOGIN_RATE_LIMIT) * 60 * 1000,
  max: 5,
  legacyHeaders: false,
  handler: (req, res, next) => {
    const error = new AppError.TooManyRequests(
      'You attempt to login multiple times more than required. Please try again after 30 minutes.'
    );
    error.statusCode = statusCodes.TO_MANY_REQUEST;
    next(error);
  },
});
