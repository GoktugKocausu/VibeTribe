import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify({
          username,
          name: response.data.name,
          surname: response.data.surname,
          token: response.data.token,
          ...response.data
        }));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Giriş işlemi başarısız oldu' };
    }
  },

  register: async (userData) => {
    try {
      await axios.post(`${API_URL}/register`, {
        username: userData.username,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        password: userData.password,
        sex: userData.sex,
        phoneNumber: userData.phoneNumber,
        status: 'ACTIVE'
      });

      const loginResponse = await axios.post(`${API_URL}/login`, {
        username: userData.username,
        password: userData.password
      });
      
      if (loginResponse.data.token) {
        localStorage.setItem('user', JSON.stringify({
          username: userData.username,
          token: loginResponse.data.token,
          ...loginResponse.data
        }));
      }
      
      return loginResponse.data;
    } catch (error) {
      if (error.response?.data?.message?.includes('duplicate key')) {
        if (error.response.data.message.includes('email')) {
          throw { message: 'Bu email adresi zaten kullanımda' };
        }
        if (error.response.data.message.includes('username')) {
          throw { message: 'Bu kullanıcı adı zaten kullanımda' };
        }
      }
      throw error.response?.data || { message: 'Kayıt işlemi başarısız oldu' };
    }
  },

  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  isAuthenticated: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!user?.token;
  }
};

export default authService; 