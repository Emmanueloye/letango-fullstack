import express from 'express';
import IUser from '../src/features/users/userModel';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
