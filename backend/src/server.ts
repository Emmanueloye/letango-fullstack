// Global imports
import 'express-async-errors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();

// Packages and modules imports
import { Server } from 'socket.io';
import http from 'http';
import app from './app';
import mongoose from 'mongoose';
import { io } from './utils/socket';

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const server = http.createServer(app);

export const socketIo = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

export const socket = io(socketIo);

// Connection to mongodb via mongoose
mongoose
  .connect(process.env.MONGODBURI as string)
  .then(() => console.log(`Database connected..`))
  .catch((err) => console.log(`name:${err.name}, message:${err.message}`));

/**
 * Set up the port from the environment variable
 */
const PORT = process.env.PORT || 8000;

/**
 * Setup environment variables and initialize the server
 */
const appServer = server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Handle unhandled promise rejections and exit the process gracefully
process.on('unhandledRejection', (err: Error) => {
  // Log the errors
  console.error(`Unhandled Rejection ⚠⚠⚠`);
  console.error(`${err.name}: ${err.message}`);
  //   Gracefully shut down the server and exit the process
  appServer.close(() => {
    process.exit(1);
  });
});
