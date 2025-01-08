import api from './axiosConfig';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { 
        'Authorization': `Bearer ${user.token}`
    } : {};
};

export const notificationService = {
    getNotifications: async () => {
        const response = await api.get('/api/notifications/all', {
            headers: getAuthHeader()
        });
        return response.data;
    },

    markAsRead: async (notificationId) => {
        const response = await api.post(`/api/notifications/${notificationId}/mark-read`, {}, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteNotification: async (notificationId) => {
        const response = await api.delete(`/api/notifications/${notificationId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    acceptFriendRequest: async (requestId) => {
        const response = await api.post(`/api/friend-requests/accept/${requestId}`, {}, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    rejectFriendRequest: async (requestId) => {
        const response = await api.post(`/api/friend-requests/decline/${requestId}`, {}, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default notificationService; 