import { Server } from 'socket.io';
// import GroupChat from '../features/chat/groupChatModel';

export const io = (io: Server) => {
  io.on('connection', (socket) => {
    // console.log('New client connected:', socket.id);

    socket.on('joinGroup', (groupRef) => {
      socket.join(groupRef);
    });

    socket.on('disconnect', (reason) => {
      console.log('Client disconnected', 'Reason: ', reason);
    });
  });
};

// socket.on('sendMessage', async (data, callback) => {
//   const { groupId, groupRef, content, sender, senderName } = data;
//   // console.log(data);

//   const message = await GroupChat.create({
//     groupId,
//     groupRef,
//     content,
//     sender,
//     senderName,
//   });

//   // Emit to sender
//   // socket.emit('receiveMessage', message);

//   // Emit to others in the room
//   socket.to(groupId).emit('receiveMessage', message);
// });
