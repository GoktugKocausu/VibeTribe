import api from "./axiosConfig";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const eventService = {
  createEvent: async (formData) => {
    try {
      const response = await api.post("/events", formData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Bir hata oluştu" };
    }
  },

  updateEvent: async (eventId, eventData) => {
    try {
      const formData = new FormData();

      // Add all event data to formData
      Object.keys(eventData).forEach((key) => {
        if (eventData[key] !== null && eventData[key] !== undefined) {
          if (key === "image" && eventData[key] instanceof File) {
            formData.append("image", eventData[key]);
          } else {
            formData.append(key, eventData[key]);
          }
        }
      });

      const response = await api.put(`/events/${eventId}`, formData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Etkinlik güncellenirken bir hata oluştu",
        }
      );
    }
  },

  getAllEvents: async () => {
    try {
      const response = await api.get("/events", {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Bir hata oluştu" };
    }
  },

  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Bir hata oluştu" };
    }
  },

  searchEvents: async (query, address) => {
    try {
      const params = new URLSearchParams();
      if (query && query.trim() !== "") params.append("query", query.trim());
      if (address && address.trim() !== "")
        params.append("address", address.trim());

      const response = await api.get(`/events/search?${params.toString()}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error searching events:", error);
      throw (
        error.response?.data || {
          message: "Etkinlik arama sırasında bir hata oluştu",
        }
      );
    }
  },

  joinEvent: async (eventId) => {
    try {
      const response = await api.post(
        `/events/${eventId}/join`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Bir hata oluştu" };
    }
  },

  leaveEvent: async (eventId) => {
    try {
      const response = await api.post(
        `/events/${eventId}/leave`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Bir hata oluştu" };
    }
  },

  cancelEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}/cancel`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Bir hata oluştu" };
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Etkinlik silinirken bir hata oluştu",
        }
      );
    }
  },

  getEventAttendees: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}/attendees`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Bir hata oluştu" };
    }
  },

  saveEvent: async (eventId) => {
    try {
      const response = await api.post(`/api/saved-events/${eventId}`, null, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Etkinlik kaydedilirken hata oluştu",
        }
      );
    }
  },

  unsaveEvent: async (eventId) => {
    try {
      const response = await api.delete(`/api/saved-events/${eventId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Etkinlikten kaldırılırken hata oluştu",
        }
      );
    }
  },

  isEventSaved: async (eventId) => {
    try {
      const response = await api.get(`/api/saved-events/${eventId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  getSavedEvents: async () => {
    try {
      const response = await api.get("/api/saved-events", {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Kaydedilen etkinlikler yüklenemedi",
        }
      );
    }
  },
};

export default eventService;
