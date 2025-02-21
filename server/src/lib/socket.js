import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

// Store user socket mapping
const userSocketMap = {};

export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  }

  // Emit the updated list of online users AFTER adding the new user
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }

    // Emit the updated online users list after removal
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
