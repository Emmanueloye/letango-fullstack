import { io } from 'socket.io-client';

// const LOCALHOST = 'http://localhost:3000';
const PRODHOST = 'https://letango.onrender.com';
export const socket = io(PRODHOST);
