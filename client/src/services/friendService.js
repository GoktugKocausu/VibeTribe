import authService from "./authService";
import api from "./axiosConfig";

export const friendService = {
  sendFriendRequest: async (recipientUsername) => {
    try {
      const response = await api.post(`/friend-requests/send?recipientUsername=${recipientUsername}`);
      return response.data;
    } catch (error) {
      console.error("Friend request error:", error.response?.data || error.message);
      throw error;
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      const response = await api.post(`/friend-requests/accept/${requestId}`);
      return response.data;
    } catch (error) {
      console.error("Accept request error:", error.response?.data || error.message);
      throw error;
    }
  },

  declineFriendRequest: async (requestId) => {
    try {
      const response = await api.post(`/friend-requests/decline/${requestId}`);
      return response.data;
    } catch (error) {
      console.error("Decline request error:", error.response?.data || error.message);
      throw error;
    }
  },

  getFriends: async () => {
    const user = authService.getCurrentUser();
    try {
      const response = await api.get(`/friend-requests/friends/${user.username}`);
      return response.data;
    } catch (error) {
      console.error("Get friends error:", error.response?.data || error.message);
      throw error;
    }
  },

  getPendingRequests: async () => {
    try {
      const response = await api.get("/friend-requests/pending");
      return response.data;
    } catch (error) {
      console.error("Get pending requests error:", error.response?.data || error.message);
      throw error;
    }
  },

  blockUser: async (blockedUsername) => {
    try {
      const response = await api.post(`/friend-requests/block?blockedUsername=${blockedUsername}`);
      return response.data;
    } catch (error) {
      console.error("Block user error:", error.response?.data || error.message);
      throw error;
    }
  },

  isBlocked: async (otherUsername) => {
    try {
      const response = await api.get(`/friend-requests/is-blocked?otherUsername=${otherUsername}`);
      return response.data;
    } catch (error) {
      console.error("Check block status error:", error.response?.data || error.message);
      throw error;
    }
  },

  areFriends: async (otherUsername) => {
    const response = await api.get(`/friend-requests/are-friends?otherUsername=${otherUsername}`);
    return response.data;
  },

  isFriendRequestPending: async (otherUsername) => {
    const response = await api.get(`/friend-requests/is-pending?otherUsername=${otherUsername}`);
    return response.data;
  },
};

export default friendService;
