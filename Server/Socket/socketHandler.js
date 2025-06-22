const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');
const Message = require('../Models/messageModel');

const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token not provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }
    
    socket.user = {
      id: user._id,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error: Invalid token'));
  }
};

const setupSocketIO = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(authenticateSocket);

  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    const userId = socket.user.id.toString();
    // console.log(`User connected: ${userId}`);
    
    // Add user to connected users map
    connectedUsers.set(userId, socket.id);
    
    // Join user to their personal room
    socket.join(userId);

    // Join chat rooms
    socket.on('join-chat', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        const isParticipant = [
          chat.client.toString(),
          chat.worker.toString()
        ].includes(userId);

        if (isParticipant) {
          socket.join(`chat:${chatId}`);
        //   console.log(`User ${userId} joined chat room: chat:${chatId}`);
        } else {
          socket.emit('error', { message: 'Not authorized to join this chat' });
        }
      } catch (error) {
        console.error('Error joining chat room:', error);
        socket.emit('error', { message: 'Server error joining chat' });
      }
    });

    socket.on('send-message', async (data) => {
      try {
        const { chatId, content } = data;
        
        if (!content || content.trim() === '') {
          socket.emit('error', { message: 'Message content cannot be empty' });
          return;
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        if (
          chat.client.toString() !== userId && 
          chat.worker.toString() !== userId
        ) {
          socket.emit('error', { message: 'Not authorized to send messages in this chat' });
          return;
        }

        const newMessage = new Message({
          chatId,
          sender: userId,
          content,
          isRead: false
        });

        await newMessage.save();

        chat.lastMessage = {
          content,
          sender: userId,
          timestamp: new Date()
        };

        const recipientId = chat.client.toString() === userId 
          ? chat.worker.toString() 
          : chat.client.toString();

        if (chat.client.toString() === userId) {
          chat.unreadWorker += 1;
        } else {
          chat.unreadClient += 1;
        }

        await chat.save();

        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'fullName email profileImageUrl');

        io.to(`chat:${chatId}`).emit('receive-message', populatedMessage);
        
        const updatedChat = await Chat.findById(chatId)
          .populate('client', 'fullName email profileImageUrl')
          .populate('worker', 'fullName email profileImageUrl')
          .populate('projectId', 'title');
          
        io.to(chat.client.toString()).emit('update-chat-list', updatedChat);
        io.to(chat.worker.toString()).emit('update-chat-list', updatedChat);
      } catch (error) {
        console.error('Error handling socket message:', error);
        socket.emit('error', { message: 'Server error sending message' });
      }
    });

    socket.on('mark-read', async ({ chatId }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }
        
        if (
          chat.client.toString() !== userId && 
          chat.worker.toString() !== userId
        ) {
          socket.emit('error', { message: 'Not authorized to access this chat' });
          return;
        }
        
        await Message.updateMany(
          { 
            chatId, 
            sender: { $ne: userId }, 
            isRead: false 
          },
          { isRead: true }
        );
        
        if (chat.client.toString() === userId) {
          if (chat.unreadClient > 0) {
            chat.unreadClient = 0;
            await chat.save();
          }
        } else {
          if (chat.unreadWorker > 0) {
            chat.unreadWorker = 0;
            await chat.save();
          }
        }
        
        const otherParticipant = chat.client.toString() === userId 
          ? chat.worker.toString() 
          : chat.client.toString();
          
        io.to(otherParticipant).emit('messages-read', { chatId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
        socket.emit('error', { message: 'Server error marking messages as read' });
      }
    });

    socket.on('disconnect', () => {
    //   console.log(`User disconnected: ${userId}`);
      connectedUsers.delete(userId);
    });
  });

  return io;
};

module.exports = setupSocketIO;