import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/auth`;
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

      console.log("LOGIN response:", data);

      if (data.token) {
        const userData = {
          username: data.username,
          name: data.name,
          surname: data.surname,
          token: data.token
        };



        saveUser(userData);
      } else {
        console.warn("Giriş başarılı ama token yok!");
        alert("Giriş başarılı ama token boş geldi.");
      }

      return data;
    } catch (err) {
      console.error("Login hatası:", err.response?.data || err.message);
      alert("Login hatası: " + (err.response?.data?.message || err.message));
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

      const { data } = await axios.post(`${API_URL}/login`, {
        username: userData.username,
        password: userData.password,
      });

      console.log("REGISTER sonrası login response:", data);

      if (data.token) {
        const savedUser = {
          username: userData.username,
          name: data.name,
          surname: data.surname,
          token: data.token
        };

        saveUser(savedUser);
      } else {
        console.warn("Kayıt sonrası login başarılı ama token yok!");
        alert("Kayıt sonrası login başarılı ama token boş.");
      }

      return data;
    } catch (err) {
      console.error("Register hatası:", err.response?.data || err.message);

      if (err.response?.data?.message?.includes('duplicate key')) {
        if (err.response.data.message.includes('email')) {
          throw { message: 'Bu email adresi zaten kullanımda' };
        }
        if (err.response.data.message.includes('username')) {
          throw { message: 'Bu kullanıcı adı zaten kullanımda' };
        }
      }

      alert("Kayıt hatası: " + (err.response?.data?.message || err.message));
      throw err.response?.data || { message: 'Kayıt işlemi başarısız oldu' };
    }
  },

  // ───────────────────────────── LOGOUT ──
  logout: () => {

    localStorage.clear();
    window.location.href = '/login';
  },

  // ──────────────────── HELPER FONKSİYONLAR ──
  getCurrentUser: () => readUser(),

  setCurrentUser: (partial) => {
    const current = readUser() || {};
    saveUser({ ...current, ...partial });
  },

  isAuthenticated: () => !!readUser()?.token,
};

export default authService;
