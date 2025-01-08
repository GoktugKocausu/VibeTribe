import api from './axiosConfig';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { 'Authorization': `Bearer ${user.token}` } : {};
};

export const messageService = {
    sendMessage: async (receiverUsername, content) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await api.post('/api/direct-messages/send', null, {
            params: {
                senderUsername: user.username,
                receiverUsername,
                content
            },
            headers: getAuthHeader()
        });
        return {
            ...response.data,
            status: response.data.status || 'sent'
        };
    },

    getConversation: async (otherUsername) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await api.get('/api/direct-messages/conversation', {
            params: {
                user1Username: user.username,
                user2Username: otherUsername
            },
            headers: getAuthHeader()
        });
        return response.data.map(msg => ({
            ...msg,
            status: msg.status || (msg.isRead ? 'read' : 'delivered')
        }));
    },

    getUnreadMessages: async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await api.get('/api/direct-messages/unread', {
            params: {
                receiverUsername: user.username
            },
            headers: getAuthHeader()
        });
        return response.data.map(msg => ({
            ...msg,
            status: msg.status || 'delivered'
        }));
    },

    markMessagesAsRead: async (senderUsername) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await api.put('/api/direct-messages/mark-read', null, {
            params: {
                senderUsername,
                receiverUsername: user.username
            },
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateMessageStatus: async (messageId, status) => {
        const response = await api.put(`/api/direct-messages/${messageId}/status`, null, {
            params: { status },
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default messageService; 