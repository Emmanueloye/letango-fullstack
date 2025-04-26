import { Request, Response } from 'express';
import AppError from '../errors';

/**
 * This middleware handles 404 Not Found errors within the app.
 * @param req req: Request Express request
 * @param res res: Response Express response
 */
const notFoundMiddleware = (req: Request, res: Response) => {
  throw new AppError.NotFound(
    'Oop! Sorry, we do not have the page you are looking for on our server.'
  );
};

export default notFoundMiddleware;
