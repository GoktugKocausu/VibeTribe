import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './styles/global.css';
import { UserProvider } from './contexts/UserContext';

import Login from './pages/Login';
import Register from './pages/Register';
import HobbySelection from './pages/HobbySelection';
import Home from './pages/Home';
import Friends from './pages/Friends';
import Notifications from './pages/Notifications';
import CreateEvent from './pages/CreateEvent';
import MainLayout from './layouts/MainLayout';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import Users from './pages/Users';

// Auth kontrol komponenti
const AuthCheck = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(location.pathname);

  useEffect(() => {
    if (!token && !isPublicPath) {
      // Giriş yapmamış kullanıcıyı login sayfasına yönlendir
      navigate('/login');
    } else if (token && isPublicPath) {
      // Giriş yapmış kullanıcıyı ana sayfaya yönlendir
      navigate('/');
    }
  }, [token, isPublicPath, navigate, location]);

  // Token yoksa ve public path değilse login'e yönlendir
  if (!token && !isPublicPath) {
    return null;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthCheck>
          <UserProvider>
            <Routes>
              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/hobby-selection" element={<HobbySelection />} />
              
              {/* Main Layout Pages */}
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/users" element={<Users />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/event/:id" element={<EventDetails />} />
              </Route>
            </Routes>
          </UserProvider>
        </AuthCheck>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;