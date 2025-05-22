import api from './axiosConfig';

const eventService = {
  createEvent: async (formData) => {
    try {
      const response = await api.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Bir hata oluştu' };
    }
  },

  updateEvent: async (eventId, eventData) => {
    try {
      const formData = new FormData();
      Object.keys(eventData).forEach(key => {
        if (eventData[key] !== null && eventData[key] !== undefined) {
          if (key === 'image' && eventData[key] instanceof File) {
            formData.append('image', eventData[key]);
          } else {
            formData.append(key, eventData[key]);
          }
        }
      });

      const response = await api.put(`/events/${eventId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Etkinlik güncellenirken bir hata oluştu' };
    }
  },

  getAllEvents: async () => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Bir hata oluştu' };
    }
  },

  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Bir hata oluştu' };
    }
  },

  searchEvents: async (query, address) => {
    try {
      const params = new URLSearchParams();
      if (query && query.trim() !== '') params.append('query', query.trim());
      if (address && address.trim() !== '') params.append('address', address.trim());
      
      const response = await api.get(`/events/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching events:', error);
      throw error.response?.data || { message: 'Etkinlik arama sırasında bir hata oluştu' };
    }
  },

  joinEvent: async (eventId) => {
    try {
      const response = await api.post(`/events/${eventId}/join`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Bir hata oluştu' };
    }
  },

  leaveEvent: async (eventId) => {
    try {
      const response = await api.post(`/events/${eventId}/leave`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Bir hata oluştu' };
    }
  },

  cancelEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Bir hata oluştu' };
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Etkinlik silinirken bir hata oluştu' };
    }
  },

  getEventAttendees: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}/attendees`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Bir hata oluştu' };
    }
  }
};

export default eventService;
