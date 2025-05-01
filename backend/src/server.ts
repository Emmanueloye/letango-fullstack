// Global imports
import 'express-async-errors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();

// This to handle uncaught exceptions but typescript should handle this but in case it doesn't
process.on('uncaughtException', (err) => {
  // Log the errors
  console.error(`Uncaught Exception ⚠⚠⚠`);
  console.error(`${err.name}: ${err.message}`);
});

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Packages and modules imports
import app from './app';
import mongoose from 'mongoose';

// Connection to mongodb via mongoose
mongoose
  .connect(process.env.MONGODBURI as string)
  .then(() => console.log(`Database connected..`))
  .catch((err) => console.log(`name:${err.name}, message:${err.message}`));

/**
 * Set up the port from the environment variable
 */
const PORT = process.env.PORT || 3000;

/**
 * Setup environment variables and initialize the server
 */
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Handle unhandled promise rejections and exit the process gracefully
process.on('unhandledRejection', (err: Error) => {
  // Log the errors
  console.error(`Unhandled Rejection ⚠⚠⚠`);
  console.error(`${err.name}: ${err.message}`);
  //   Gracefully shut down the server and exit the process
  server.close(() => {
    process.exit(1);
  });
});
