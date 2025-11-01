import { environment } from '../models/environment.js';

/**
 * Initialize Socket.IO event handlers
 */
export function initSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join a channel room
    socket.on('join_channel', (channelId) => {
      socket.join(channelId);
      console.log(`User ${socket.id} joined channel: ${channelId}`);
    });

    // Leave a channel room
    socket.on('leave_channel', (channelId) => {
      socket.leave(channelId);
      console.log(`User ${socket.id} left channel: ${channelId}`);
    });

    // Handle new message
    socket.on('send_message', (data) => {
      const { channelId, userId, content } = data;
      
      try {
        const message = environment.addMessage(channelId, userId, content);
        
        // Broadcast to all clients in the channel
        io.to(channelId).emit('new_message', message);
        
        // Also broadcast to all clients for unread updates
        io.emit('unread_update', {
          channelId,
          count: environment.getCurrentChannel()?.unread || 0
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { channelId, userId, userName } = data;
      socket.to(channelId).emit('user_typing', { userId, userName });
    });

    // Handle user presence update
    socket.on('update_presence', (data) => {
      const { userId, status } = data;
      const user = environment.users.find(u => u.id === userId);
      if (user) {
        user.status = status;
        io.emit('presence_update', { userId, status });
      }
    });

    // Handle message reaction
    socket.on('add_reaction', (data) => {
      const { messageId, channelId, reaction, userId } = data;
      
      // Find and update message (simple implementation)
      io.to(channelId).emit('reaction_added', {
        messageId,
        reaction,
        userId
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  console.log('📡 Socket.IO handlers initialized');
}
