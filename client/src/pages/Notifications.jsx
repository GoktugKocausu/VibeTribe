import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Badge,
  Snackbar,
  Alert
} from '@mui/material';
import {
  NotificationsOff as NotificationsOffIcon,
  Circle as CircleIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';

const NotificationItem = ({ notification, onDelete, onClick, onError, onSnackbarChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getIcon = () => {
    switch (notification.type) {
      case 'event':
        return <EventIcon color="primary" />;
      case 'friend':
        return <PeopleIcon color="primary" />;
      case 'comment':
        return <CommentIcon color="primary" />;
      default:
        return <CircleIcon color="primary" />;
    }
  };

  const getNotificationContent = () => {
    switch (notification.type) {
      case 'friend':
        return {
          title: `${notification.senderName || 'Birisi'} arkadaşlık isteği gönderdi`,
          message: notification.message || `${notification.senderName || 'Kullanıcı'} size arkadaşlık isteği gönderdi. Kabul ederek arkadaş olabilirsiniz.`
        };
      case 'event':
        return {
          title: notification.title || 'Etkinlik Bildirimi',
          message: notification.message
        };
      case 'comment':
        return {
          title: notification.title || 'Yorum Bildirimi',
          message: notification.message
        };
      default:
        return {
          title: notification.title,
          message: notification.message
        };
    }
  };

  const handleAcceptFriend = async (e) => {
    e.stopPropagation();
    try {
      if (!notification.requestId) {
        console.error('No request ID found for friend request notification:', notification);
        onError('Arkadaşlık isteği işlenirken bir hata oluştu');
        return;
      }
      console.log('Accepting friend request with ID:', notification.requestId);
      await notificationService.acceptFriendRequest(notification.requestId);
      onDelete(notification.notificationId);
      onSnackbarChange({ open: true, message: 'Arkadaşlık isteği kabul edildi', severity: 'success' });
    } catch (error) {
      console.error('Friend request acceptance failed:', error);
      onError('Arkadaşlık isteği kabul edilirken bir hata oluştu');
    }
  };

  const handleRejectFriend = async (e) => {
    e.stopPropagation();
    try {
      if (!notification.requestId) {
        console.error('No request ID found for friend request notification:', notification);
        onError('Arkadaşlık isteği işlenirken bir hata oluştu');
        return;
      }
      console.log('Rejecting friend request with ID:', notification.requestId);
      await notificationService.rejectFriendRequest(notification.requestId);
      onDelete(notification.notificationId);
      onSnackbarChange({ open: true, message: 'Arkadaşlık isteği reddedildi', severity: 'info' });
    } catch (error) {
      console.error('Friend request rejection failed:', error);
      onError('Arkadaşlık isteği reddedilirken bir hata oluştu');
    }
  };

  const content = getNotificationContent();

  return (
    <>
      <ListItem
        sx={{
          py: 2,
          px: { xs: 2, sm: 3 },
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
          },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1, sm: 0 }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          width: '100%',
          pr: notification.type === 'friend' && !notification.read ? { xs: 0, sm: 15 } : 0
        }}>
          <ListItemAvatar>
            {notification.type === 'friend' && notification.senderAvatar ? (
              <Avatar
                src={notification.senderAvatar}
                alt={notification.senderName}
                sx={{ width: 40, height: 40 }}
              />
            ) : (
              <Avatar
                sx={{
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  width: 40,
                  height: 40
                }}
              >
                {getIcon()}
              </Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: !notification.read ? 600 : 400,
                  color: !notification.read ? 'text.primary' : 'text.secondary',
                  mb: 0.5,
                }}
              >
                {content.title}
              </Typography>
            }
            secondary={
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: !notification.read ? 'text.primary' : 'text.secondary',
                    opacity: !notification.read ? 0.9 : 0.7,
                  }}
                >
                  {content.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    color: 'text.secondary',
                  }}
                >
                  {notification.time}
                </Typography>
              </Box>
            }
          />
        </Box>
        
        {notification.type === 'friend' && !notification.read ? (
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            mt: { xs: 1, sm: 0 },
            ml: { xs: 0, sm: 'auto' },
            alignSelf: { xs: 'flex-end', sm: 'center' }
          }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleAcceptFriend}
              sx={{
                minWidth: '90px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Kabul Et
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={handleRejectFriend}
              sx={{
                minWidth: '90px',
                borderColor: 'error.light',
                '&:hover': {
                  borderColor: 'error.main',
                  backgroundColor: 'error.lighter',
                },
              }}
            >
              Reddet
            </Button>
          </Box>
        ) : notification.type !== 'friend' && (
          <IconButton 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.notificationId);
            }}
            sx={{ 
              ml: 'auto',
              color: 'text.secondary',
              opacity: 0.6,
              '&:hover': { 
                opacity: 1,
                color: 'error.main',
                backgroundColor: 'error.lighter'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </ListItem>
      <Divider component="li" />
    </>
  );
};

const EmptyState = ({ onExplore }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 2,
      textAlign: 'center',
    }}
  >
    <NotificationsOffIcon
      sx={{
        fontSize: 64,
        color: 'primary.main',
        opacity: 0.3,
        mb: 2,
      }}
    />
    <Typography
      variant="h6"
      color="text.secondary"
      sx={{ mb: 1 }}
    >
      Henüz Bildirim Yok
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        maxWidth: 300,
        mb: 3,
      }}
    >
      Etkinliklere katıldıkça ve arkadaş edindikçe burada bildirimlerinizi göreceksiniz.
    </Typography>
    <Button
      variant="contained"
      color="primary"
      onClick={onExplore}
    >
      Etkinlikleri Keşfet
    </Button>
  </Box>
);

const Notifications = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      console.log('All notifications:', data);
      
      // Detailed logging for friend request notifications
      const friendNotifications = data.filter(n => n.type === 'friend');
      console.log('Friend request notifications:', friendNotifications);
      
      // Verify notification structure
      data.forEach(notification => {
        if (notification.type === 'friend') {
          console.log('Friend notification details:', {
            notificationId: notification.notificationId,
            requestId: notification.requestId,
            type: notification.type,
            content: notification.content,
            sender: notification.senderName,
            readStatus: notification.readStatus
          });
          
          if (!notification.requestId) {
            console.warn('Friend request notification missing requestId:', notification);
          }
        }
      });
      
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Bildirimler yüklenirken bir hata oluştu');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteNotification = async (id) => {
    try {
      console.log('Deleting notification with ID:', id);
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(notification => notification.notificationId !== id));
    } catch (err) {
      setError('Bildirim silinirken bir hata oluştu');
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await notificationService.markAsRead(notification.notificationId);
        setNotifications(notifications.map(n => 
          n.notificationId === notification.notificationId ? { ...n, read: true } : n
        ));
      } catch (err) {
        setError('Bildirim durumu güncellenirken bir hata oluştu');
      }
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'event':
        navigate(`/events/${notification.eventId}`);
        break;
      case 'friend':
        navigate(`/friends`);
        break;
      case 'comment':
        navigate(`/events/${notification.eventId}`);
        break;
      default:
        break;
    }
  };

  const filteredNotifications = tabValue === 0 
    ? notifications 
    : tabValue === 1 
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.read);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Bildirimler
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Etkinlikler ve arkadaşlarınızla ilgili güncellemeler
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              px: { xs: 1, sm: 2 },
              '& .MuiTab-root': {
                minHeight: 48,
                py: 1,
                '& .MuiBadge-root': {
                  mr: 2,
                },
              },
            }}
          >
            <Tab 
              label="Tümü" 
              icon={
                <Badge 
                  badgeContent={notifications.length} 
                  color="error"
                >
                  <CircleIcon sx={{ display: 'none' }} />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab 
              label="Okunmamış" 
              icon={
                <Badge 
                  badgeContent={notifications.filter(n => !n.read).length} 
                  color="error"
                >
                  <CircleIcon sx={{ display: 'none' }} />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab 
              label="Okunmuş"
              icon={
                <Badge 
                  badgeContent={notifications.filter(n => n.read).length} 
                  color="default"
                >
                  <CircleIcon sx={{ display: 'none' }} />
                </Badge>
              }
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {filteredNotifications.length > 0 ? (
          <List disablePadding>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.notificationId}
                notification={notification}
                onDelete={handleDeleteNotification}
                onClick={() => handleNotificationClick(notification)}
                onError={setError}
                onSnackbarChange={setSnackbar}
              />
            ))}
          </List>
        ) : (
          <EmptyState onExplore={() => navigate('/events')} />
        )}
      </Paper>

      {error && (
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Notifications; 