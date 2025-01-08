import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  TextField,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { friendService } from '../services/friendService';
import { messageService } from '../services/messageService';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import CircleIcon from '@mui/icons-material/Circle';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 104px)',
  backgroundColor: theme.palette.background.default,
  padding: '20px',
  gap: '20px',
  maxWidth: '1600px',
  margin: '0 auto',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    padding: '12px',
    gap: '12px',
    height: 'calc(100vh - 88px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0',
    gap: '0',
    height: 'calc(100vh - 64px)',
  }
}));

const FriendsList = styled(Paper)(({ theme }) => ({
  width: '350px',
  borderRadius: theme.shape.borderRadius,
  borderRight: 'none',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  [theme.breakpoints.down('md')]: {
    width: '280px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  }
}));

const ChatArea = styled(Paper)(({ theme }) => ({
  flex: 1,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  [theme.breakpoints.down('sm')]: {
    borderRadius: 0,
  }
}));

const MessageArea = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflowY: 'auto',
  backgroundColor: '#f0f2f5',
}));

const MessageInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const Message = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  backgroundColor: isOwn ? theme.palette.primary.main : '#fff',
  color: isOwn ? '#fff' : theme.palette.text.primary,
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  position: 'relative'
}));

const MessageStatus = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginTop: 4,
  '& .MuiSvgIcon-root': {
    fontSize: 16,
    marginLeft: 4
  }
}));

const MessagesContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const NotificationItem = ({ notification, onDelete, onClick }) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (notification.type) {
      case 'event':
        return <EventIcon />;
      case 'friend':
        return <PeopleIcon />;
      case 'message':
        return <SendIcon />;
      default:
        return <CircleIcon />;
    }
  };

  return (
    <>
      <ListItem
        button
        onClick={() => onClick(notification)}
        sx={{
          py: 2,
          px: { xs: 2, sm: 3 },
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
          },
          pr: { xs: '48px', sm: '48px' }
        }}
        secondaryAction={
          <IconButton 
            edge="end" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            sx={{ 
              opacity: 0.7,
              '&:hover': { opacity: 1 },
              position: 'absolute',
              right: theme.spacing(1)
            }}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.main',
            }}
          >
            {getIcon()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={notification.title}
          secondary={notification.message}
        />
      </ListItem>
    </>
  );
};

const Friends = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [mobileView, setMobileView] = useState('list');
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addFriendDialog, setAddFriendDialog] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch friends list
  useEffect(() => {
    loadFriends();
  }, []);

  // Load messages when a friend is selected
  useEffect(() => {
    if (selectedFriend) {
      loadMessages(selectedFriend.username);
      // Mark messages as read
      messageService.markMessagesAsRead(selectedFriend.username);
    }
  }, [selectedFriend]);

  // Auto-update message status
  useEffect(() => {
    const updateMessageStatuses = async () => {
      if (selectedFriend && messages.length > 0) {
        const undeliveredMessages = messages.filter(
          msg => msg.senderUsername !== selectedFriend.username && msg.status === 'sent'
        );

        for (const msg of undeliveredMessages) {
          try {
            await messageService.updateMessageStatus(msg.messageId, 'delivered');
            setMessages(prev => prev.map(m => 
              m.messageId === msg.messageId ? { ...m, status: 'delivered' } : m
            ));
          } catch (error) {
            console.error('Error updating message status:', error);
          }
        }
      }
    };

    updateMessageStatuses();
  }, [messages, selectedFriend]);

  const loadFriends = async () => {
    try {
      const friendsList = await friendService.getFriends();
      const transformedFriends = await Promise.all(friendsList.map(async friend => {
        // Get last message for each friend
        const conversation = await messageService.getConversation(friend.username);
        const lastMessage = conversation.length > 0 ? conversation[conversation.length - 1] : null;
        
        return {
          id: friend.userId,
          username: friend.username,
          profileImage: friend.profilePicture,
          lastMessage: lastMessage ? lastMessage.content : '',
          lastMessageTime: lastMessage ? lastMessage.timestamp : null,
          hasUnread: lastMessage ? !lastMessage.isRead && lastMessage.senderUsername === friend.username : false
        };
      }));
      setFriends(transformedFriends);
    } catch (error) {
      console.error('Error loading friends:', error);
      showSnackbar('Error loading friends list', 'error');
    }
  };

  // Update friends list when new message is sent or received
  const updateFriendLastMessage = (friendUsername, newMessage) => {
    setFriends(prevFriends => prevFriends.map(friend => {
      if (friend.username === friendUsername) {
        return {
          ...friend,
          lastMessage: newMessage.content,
          lastMessageTime: newMessage.timestamp,
          hasUnread: newMessage.senderUsername === friendUsername && !newMessage.isRead
        };
      }
      return friend;
    }));
  };

  const loadMessages = async (username) => {
    try {
      const conversation = await messageService.getConversation(username);
      setMessages(conversation);
      // Mark messages as read
      await messageService.markMessagesAsRead(username);
    } catch (error) {
      showSnackbar('Error loading messages', 'error');
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedFriend) {
      try {
        const sentMessage = await messageService.sendMessage(selectedFriend.username, message.trim());
        setMessages(prev => [...prev, sentMessage]);
        updateFriendLastMessage(selectedFriend.username, sentMessage);
        setMessage('');
      } catch (error) {
        showSnackbar('Error sending message', 'error');
      }
    }
  };

  const handleAddFriend = async () => {
    try {
      await friendService.sendFriendRequest(newFriendUsername);
      setAddFriendDialog(false);
      setNewFriendUsername('');
      showSnackbar('Friend request sent successfully', 'success');
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      showSnackbar(
        errorMessage === 'User not found' ? 'User not found' :
        errorMessage === 'Friend request already sent' ? 'Friend request already sent to this user' :
        errorMessage === 'Cannot send friend request to yourself' ? 'Cannot send friend request to yourself' :
        errorMessage === 'Users are already friends' ? 'You are already friends with this user' :
        'An error occurred while sending friend request',
        'error'
      );
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
    if (isMobile) {
      setMobileView('chat');
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setMobileView('list');
    }
  };

  const renderMessageStatus = (message, isOwn) => {
    if (!isOwn) return null;

    const iconColor = message.isRead ? '#fff' : '#fff';
    
    return (
      <MessageStatus>
        <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7, color: '#fff' }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
        {message.status === 'sent' && <DoneIcon sx={{ opacity: 0.7, color: '#fff' }} />}
        {(message.status === 'delivered' || message.status === 'read') && (
          <DoneAllIcon sx={{ opacity: 0.7, color: iconColor }} />
        )}
      </MessageStatus>
    );
  };

  const renderFriendsList = () => (
    <FriendsList elevation={0}>
      <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Search friends..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#F9FAFB',
              '&:hover': {
                backgroundColor: '#F3F4F6'
              }
            }
          }}
        />
        <IconButton 
          color="primary" 
          onClick={() => setAddFriendDialog(true)}
          sx={{ backgroundColor: '#F9FAFB', '&:hover': { backgroundColor: '#F3F4F6' } }}
        >
          <PersonAddIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ flex: 1, overflowY: 'auto' }}>
        {friends
          .filter(friend => friend.username.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((friend) => (
            <React.Fragment key={friend.id}>
              <ListItem
                button
                selected={selectedFriend?.id === friend.id}
                onClick={() => handleFriendSelect(friend)}
                sx={{
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={friend.profileImage}
                    sx={{
                      bgcolor: theme.palette.primary.main
                    }}
                  >
                    {friend.username?.[0]?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: friend.hasUnread ? 600 : 400 }}>
                        {friend.username}
                      </Typography>
                      {friend.lastMessageTime && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(friend.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {friend.hasUnread && (
                        <CircleIcon 
                          sx={{ 
                            fontSize: 8, 
                            color: 'primary.main',
                            mr: 0.5
                          }} 
                        />
                      )}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '200px',
                          fontWeight: friend.hasUnread ? 600 : 400
                        }}
                      >
                        {friend.lastMessage || 'No messages yet'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
      </List>
    </FriendsList>
  );

  const renderChatArea = () => (
    <ChatArea elevation={0}>
      {selectedFriend ? (
        <>
          {isMobile && (
            <AppBar position="static" color="inherit" elevation={0}>
              <Toolbar sx={{ minHeight: '56px !important' }}>
                <IconButton edge="start" onClick={handleBackToList} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={selectedFriend.profileImage} sx={{ width: 32, height: 32, mr: 1 }}>
                    {selectedFriend.username[0]}
                  </Avatar>
                  <Typography variant="subtitle1">{selectedFriend.username}</Typography>
                </Box>
              </Toolbar>
            </AppBar>
          )}
          {!isMobile && (
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">{selectedFriend.username}</Typography>
            </Box>
          )}
          <MessageArea>
            <MessagesContainer>
              {messages.map((msg) => {
                const isOwn = msg.senderUsername !== selectedFriend.username;
                return (
                  <Message key={msg.messageId} isOwn={isOwn}>
                    <Typography>{msg.content}</Typography>
                    {renderMessageStatus(msg, isOwn)}
                  </Message>
                );
              })}
            </MessagesContainer>
          </MessageArea>
          <MessageInput>
            <TextField
              fullWidth
              placeholder="Mesajınızı yazın..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSendMessage} color="primary">
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#F9FAFB',
                  '&:hover': {
                    backgroundColor: '#F3F4F6'
                  }
                }
              }}
            />
          </MessageInput>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
            gap: 2,
            color: 'text.secondary',
            p: 3
          }}
        >
          <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Sohbet etmek için bir arkadaş seçin
          </Typography>
        </Box>
      )}
    </ChatArea>
  );

  return (
    <Box sx={{ 
      backgroundColor: '#F9FAFB',
      minHeight: 'calc(100vh - 64px)',
      width: '100%'
    }}>
      <ChatContainer>
        {isMobile ? (
          mobileView === 'list' ? renderFriendsList() : renderChatArea()
        ) : (
          <>
            {renderFriendsList()}
            {renderChatArea()}
          </>
        )}
      </ChatContainer>

      {/* Add Friend Dialog */}
      <Dialog open={addFriendDialog} onClose={() => setAddFriendDialog(false)}>
        <DialogTitle>Arkadaş Ekle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Kullanıcı Adı"
            type="text"
            fullWidth
            variant="outlined"
            value={newFriendUsername}
            onChange={(e) => setNewFriendUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddFriendDialog(false)}>İptal</Button>
          <Button onClick={handleAddFriend} variant="contained">Arkadaşlık İsteği Gönder</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Friends; 