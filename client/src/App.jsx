import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import ThemeContext, { ThemeProviderWrapper } from './contexts/ThemeContext';
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
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProviderWrapper>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <UserProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/hobby-selection" element={<HobbySelection />} />
                  <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/create-event" element={<CreateEvent />} />
                    <Route path="/event/:id" element={<EventDetails />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                </Routes>
              </UserProvider>
            </BrowserRouter>
          </ThemeProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProviderWrapper>
  );
}

export default App;
