// Import packages
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xXssProtection from 'x-xss-protection';
import path from 'path';

import './utils/cache';
//============ Import error handlers modules ==========//
import notFoundMiddleware from './middlewares/notFoundMiddleware';
import globalErrorMiddleware from './middlewares/globalErrorMiddleware';
import AppError from './errors';
import statusCodes from './errors/statusCodes';

//============ Import routers modules ==========//
import authRouter from './features/users/authRoutes';
import userRouter from './features/users/userRoutes';
import transactionRouter from './features/transactions/transactionRoutes';
import transferRouter from './features/transactions/transferRoute';
import beneficiaryRouter from './features/beneficiaries/beneficiaryRoutes'; //start here
import groupRouter from './features/group/groupRoutes';
import memberRouter from './features/members/memberRoutes';
import fundClassRouter from './features/groupExpenseHead/fundClassRoutes';
import groupTransactRouter from './features/transactions/groupTransactionRoutes';

// setup the application
/**
 * Creates an instance of an Express application
 */
const app = express();

// setup app wide middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Security packages
// Set HTTP request headers
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data: blob:'],
    },
  })
);

app.use(cors());
app.set('trust proxy', 1);
// To limit the rate of request
app.use(
  rateLimit({
    windowMs: Number(process.env.APP_RATE_LIMIT) * 60 * 1000, //30 minutes request
    limit: 200,
    legacyHeaders: false,
    // This help use the global error handler for the error thrown here.
    handler: (req, res, next) => {
      const error = new AppError.TooManyRequests(
        'You attempt to login multiple times more than required. Please try again after 30 minutes.'
      );
      error.statusCode = statusCodes.TO_MANY_REQUEST;
      next(error);
    },
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json({ limit: '20kb' }));

app.use(cookieParser(process.env.JWT_SECRET));

// To sanitize user input to prevent nosql injection
app.use(mongoSanitize());

// To prevent xss attack
app.use(xXssProtection());

// To prevent http paramater pollution
app.use(hpp());

//==================== Serves static file ============//
// Middleware to serve static files from the client/dist directory
app.use(express.static(path.resolve(__dirname, './../../client/dist')));

//==================== Mount routes =================//
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/personal', transactionRouter);
app.use('/api/v1/beneficiaries', beneficiaryRouter);
app.use('/api/v1/transfer', transferRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/api/v1/members', memberRouter);
app.use('/api/v1/fundClasses', fundClassRouter);
app.use('/api/v1/group-transacts', groupTransactRouter);

//==================== send the html file for all routes =================//
app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, './../../client/dist', 'index.html'));
});

//========= Mount global error middlewares ========//
app.use(notFoundMiddleware);
app.use(globalErrorMiddleware);

export default app;
