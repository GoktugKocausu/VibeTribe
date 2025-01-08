import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
  Star as ReputationIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const searchUsers = async (query = '') => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const response = await userService.searchUsers(query, currentUser?.username);
      setUsers(response.content || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchUsers();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Kullanıcılar
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Kullanıcı ara..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: 'white', borderRadius: 1 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.username}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
                onClick={() => handleUserClick(user.username)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={user.profilePicture ? `http://localhost:8080/api/users/profile-picture/${user.profilePicture}` : null}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    >
                      {user.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {user.name} {user.surname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {user.bio || 'Henüz bir bio eklenmemiş'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      icon={<TrophyIcon />}
                      label={`${user.hostedEvents || 0} Etkinlik`}
                      size="small"
                      sx={{ bgcolor: '#E0F2FE', color: '#0284C7' }}
                    />
                    <Chip
                      icon={<ReputationIcon />}
                      label={`${user.reputationPoints || 0} Rep.`}
                      size="small"
                      sx={{ bgcolor: '#E0F2FE', color: '#0284C7' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Users; 