import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    loadUser();
    // Her 1 saniyede bir kullanıcı bilgilerini kontrol et
    const interval = setInterval(loadUser, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateUser = (newUserData) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) return;

      const updatedUser = { ...currentUser, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 