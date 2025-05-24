import api from './axiosConfig';

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications/all');
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/mark-read`);
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  acceptFriendRequest: async (requestId) => {
    const response = await api.post(`/friend-requests/accept/${requestId}`);
    return response.data;
  },

  rejectFriendRequest: async (requestId) => {
    const response = await api.post(`/friend-requests/decline/${requestId}`);
    return response.data;
  }
};

export default notificationService;
