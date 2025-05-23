import api from './axiosConfig';

export const messageService = {
  sendMessage: async (receiverUsername, content) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.post('/direct-messages/send', null, {
      params: {
        senderUsername: user.username,
        receiverUsername,
        content
      }
    });
    return {
      ...response.data,
      status: response.data.status || 'sent'
    };
  },

  getConversation: async (otherUsername) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.get('/direct-messages/conversation', {
      params: {
        user1Username: user.username,
        user2Username: otherUsername
      }
    });
    return response.data.map(msg => ({
      ...msg,
      status: msg.status || (msg.isRead ? 'read' : 'delivered')
    }));
  },

  getUnreadMessages: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.get('/direct-messages/unread', {
      params: {
        receiverUsername: user.username
      }
    });
    return response.data.map(msg => ({
      ...msg,
      status: msg.status || 'delivered'
    }));
  },

  markMessagesAsRead: async (senderUsername) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.put('/direct-messages/mark-read', null, {
      params: {
        senderUsername,
        receiverUsername: user.username
      }
    });
    return response.data;
  },

  updateMessageStatus: async (messageId, status) => {
    const response = await api.put(`/api/direct-messages/${messageId}/status`, null, {
      params: { status },
      headers: getAuthHeader()
    });
    return response.data;
  },

  // ✅ Toplam unread message sayısını döndürür
  getTotalUnreadCount: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.get('/api/direct-messages/unread-count', {
      params: {
        receiverUsername: user.username
      },
      headers: getAuthHeader()
    });
    return response.data.count; // örn: { "count": 5 }
  }
};

export default messageService;
