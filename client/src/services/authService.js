import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';
const USER_KEY = 'user';

const saveUser = (userObj) =>
  localStorage.setItem(USER_KEY, JSON.stringify(userObj));

const readUser = () =>
  JSON.parse(localStorage.getItem(USER_KEY));

const authService = {
  // ───────────────────────────── LOGIN ──
  login: async (username, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, { username, password });

      if (data.token) {
        saveUser({ username, name: data.name, surname: data.surname, ...data });
      }
      return data;
    } catch (err) {
      throw err.response?.data || { message: 'Giriş işlemi başarısız oldu' };
    }
  },

  // ─────────────────────────── REGISTER ──
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
        status: 'ACTIVE',
      });

      // otomatik login
      const { data } = await axios.post(`${API_URL}/login`, {
        username: userData.username,
        password: userData.password,
      });

      if (data.token) {
        saveUser({ username: userData.username, ...data });
      }
      return data;
    } catch (err) {
      if (err.response?.data?.message?.includes('duplicate key')) {
        if (err.response.data.message.includes('email')) {
          throw { message: 'Bu email adresi zaten kullanımda' };
        }
        if (err.response.data.message.includes('username')) {
          throw { message: 'Bu kullanıcı adı zaten kullanımda' };
        }
      }
      throw err.response?.data || { message: 'Kayıt işlemi başarısız oldu' };
    }
  },

  // ───────────────────────────── LOGOUT ──
  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  },

  // ──────────────────── HELPER FONKSİYONLAR ──
  /** localStorage'daki user objesini döndürür */
  getCurrentUser: () => readUser(),

  /** user objesini günceller / oluşturur */
  setCurrentUser: (partial) => {
    const current = readUser() || {};
    saveUser({ ...current, ...partial });
  },

  /** token var mı? */
  isAuthenticated: () => !!readUser()?.token,
};

export default authService;
