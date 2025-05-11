import authService from './authService';
import api from './axiosConfig';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { 'Authorization': `Bearer ${user.token}` } : {};
};

const userService = {
  getUserProfile: async (username) => {
    try {
      const response = await api.get(`/api/profile/${username}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profil bilgileri alınamadı' };
    }
  },

  updateUserProfile: async (username, profileData) => {
    try {
      const response = await api.put(`/api/profile/update`, profileData, {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profil güncellenemedi' };
    }
  },

  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/profile/upload-picture', formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Profile picture upload error:', error);
      throw error.response?.data || { message: 'Profil fotoğrafı yüklenemedi' };
    }
  },

  getUserStats: async (username) => {
    try {
      const requests = [
        api.get(`/api/events/hosted/${username}/count`, { headers: getAuthHeader() })
          .catch(() => ({ data: 0 })), // Default to 0 if request fails
        api.get(`/api/friend-requests/friends/${username}`, { headers: getAuthHeader() })
          .catch(() => ({ data: [] })), // Default to empty array if request fails
        api.get(`/api/reputation/total/${username}`, { headers: getAuthHeader() })
          .catch(() => ({ data: { totalReputation: 0 } })) // Default to 0 if request fails
      ];

      const [hostedEventsResponse, friendsResponse, reputationResponse] = await Promise.all(requests);

      return {
        hostedEvents: hostedEventsResponse.data,
        friends: friendsResponse.data.length,
        reputation: reputationResponse.data.totalReputation
      };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return {
        hostedEvents: 0,
        friends: 0,
        reputation: 0
      };
    }
  },

  updateUserHobbies: async (username, hobbies) => {
    try {
      const response = await api.post(`/api/profile/${username}/hobbies`, hobbies, {
        headers: getAuthHeader()
      });

      // Update current user info in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUserData = {
        ...currentUser,
        interests: hobbies
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Hobiler güncellenirken bir hata oluştu' };
    }
  },

  giveReputation: async (recipientUsername, points, reason) => {
    try {
      const response = await api.post('/api/reputation/give', {
        recipientUsername,
        points,
        reason
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  getReputationHistory: async (username) => {
    try {
      const response = await api.get(`/api/reputation/history/${username}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Reputation geçmişi alınamadı' };
    }
  },

  searchUsers: async () => {
    try {
      const user = authService.getCurrentUser();
      const response = await api.get(`/api/friend-requests/friends/${user.username}`, { headers: getAuthHeader() })
          .catch(() => ({ data: [] }))
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Kullanıcılar aranamadı' };
    }
  },

    searchAllUsers: async (query = '', currentUsername) => {
    try {
      const response = await api.get(`/api/profile/search?query=${encodeURIComponent(query)}&currentUsername=${encodeURIComponent(currentUsername)}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Kullanıcılar aranamadı' };
    }
  },

};

export default userService; 