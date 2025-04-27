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

//============ Import routers modules ==========//
import authRouter from './features/users/authRoutes';

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
      'img-src': ["'self'", 'https: data:'],
    },
  })
);

app.use(cors());

// To limit the rate of request
app.use(
  rateLimit({
    windowMs: Number(process.env.APP_RATE_LIMIT) * 60 * 1000, //30 minutes request
    limit: 200,
    legacyHeaders: false,
    message: 'Too many requests. Please try again in the next 30 minutes.',
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

//==================== send the html file for all routes =================//
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, './../../client/dist', 'index.html'));
});

//========= Mount global error middlewares ========//
app.use(notFoundMiddleware);
app.use(globalErrorMiddleware);

export default app;
