import api from './axiosConfig';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { 'Authorization': `Bearer ${user.token}` } : {};
};

export const friendService = {
    sendFriendRequest: async (recipientUsername) => {
        try {
            const response = await api.post(`/api/friend-requests/send?recipientUsername=${recipientUsername}`, {}, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Friend request error:', error.response?.data || error.message);
            throw error;
        }
    },

    acceptFriendRequest: async (requestId) => {
        try {
            const response = await api.post(`/api/friend-requests/accept/${requestId}`, {}, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Accept request error:', error.response?.data || error.message);
            throw error;
        }
    },

    declineFriendRequest: async (requestId) => {
        try {
            const response = await api.post(`/api/friend-requests/decline/${requestId}`, {}, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Decline request error:', error.response?.data || error.message);
            throw error;
        }
    },

    getFriends: async () => {
        try {
            const response = await api.get('/api/friend-requests/friends', {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Get friends error:', error.response?.data || error.message);
            throw error;
        }
    },

    getPendingRequests: async () => {
        try {
            const response = await api.get('/api/friend-requests/pending', {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Get pending requests error:', error.response?.data || error.message);
            throw error;
        }
    },

    blockUser: async (blockedUsername) => {
        try {
            const response = await api.post(`/api/friend-requests/block?blockedUsername=${blockedUsername}`, {}, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Block user error:', error.response?.data || error.message);
            throw error;
        }
    },

    isBlocked: async (otherUsername) => {
        try {
            const response = await api.get(`/api/friend-requests/is-blocked?otherUsername=${otherUsername}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Check block status error:', error.response?.data || error.message);
            throw error;
        }
    }
};

export default friendService; 