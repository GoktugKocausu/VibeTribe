import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  Grid,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  EventBusy as NoEventsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import eventService from '../services/eventService';
import authService from '../services/authService';
import { format, isToday, isSameDay, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [allEvents, setAllEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [filteredGroupedEvents, setFilteredGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    
    // Check if we have search results from navigation
    if (location.state?.searchResults) {
      handleSearchResults(location.state.searchResults);
    } else {
      fetchEvents();
    }

    // Listen for search results updates
    const handleSearchUpdate = (event) => {
      handleSearchResults(event.detail);
    };
    window.addEventListener('updateSearchResults', handleSearchUpdate);

    return () => {
      window.removeEventListener('updateSearchResults', handleSearchUpdate);
    };
  }, [location.state]);

  const handleSearchResults = (results) => {
    setAllEvents(results);
    const grouped = groupEventsByDate(results);
    setGroupedEvents(grouped);
    filterEventsBySelectedDate(grouped);
  };

  useEffect(() => {
    if (allEvents.length > 0) {
      const grouped = groupEventsByDate(allEvents);
      setGroupedEvents(grouped);
      filterEventsBySelectedDate(grouped);
    }
  }, [selectedDate, allEvents]);

  const groupEventsByDate = (events) => {
    const now = new Date();
    const grouped = events.reduce((acc, event) => {
      const eventDate = parseISO(event.startTime);
      // Skip past events
      if (eventDate < now) {
        return acc;
      }
      const dateStr = format(eventDate, 'yyyy-MM-dd');
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(event);
      return acc;
    }, {});

    // Sort events within each date group
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    });

    return grouped;
  };

  const filterEventsBySelectedDate = (grouped) => {
    if (!selectedDate) {
      setFilteredGroupedEvents(grouped);
      return;
    }

    const selectedDateStr = format(selectedDate.toDate(), 'yyyy-MM-dd');
    const now = new Date();
    const selectedDateStart = parseISO(selectedDateStr);
    
    // If selected date is in the past, show no events
    if (selectedDateStart < now && !isSameDay(selectedDateStart, now)) {
      setFilteredGroupedEvents({});
      return;
    }
    
    if (selectedDate.isSame(dayjs(), 'day')) {
      // If today is selected, show all future events
      setFilteredGroupedEvents(grouped);
    } else {
      // Show only events for the selected date
      const filteredEvents = {};
      if (grouped[selectedDateStr]) {
        filteredEvents[selectedDateStr] = grouped[selectedDateStr];
      }
      setFilteredGroupedEvents(filteredEvents);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      console.log('Events data:', data);
      setAllEvents(data);
    } catch (err) {
      setError(err.message || 'Etkinlikler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await eventService.joinEvent(eventId);
      fetchEvents();
    } catch (err) {
      setError(err.message || 'Etkinliğe katılırken bir hata oluştu');
    }
  };

  const handleDeleteEvent = async (e, eventId) => {
    e.stopPropagation(); // Prevent event card click
    if (window.confirm('Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        await eventService.deleteEvent(eventId);
        // Etkinliği listeden kaldır
        setAllEvents(allEvents.filter(event => event.eventId !== eventId));
      } catch (error) {
        console.error('Etkinlik silinirken hata oluştu:', error);
      }
    }
  };

  const NoEventsFound = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
        bgcolor: 'white',
        borderRadius: 2,
        border: '1px dashed #E2E8F0'
      }}
    >
      <NoEventsIcon sx={{ fontSize: 64, color: '#94A3B8', mb: 2 }} />
      <Typography variant="h6" sx={{ color: '#334155', mb: 1 }}>
        Bu tarihte etkinlik bulunamadı
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {selectedDate.format('D MMMM YYYY')} tarihinde planlanmış etkinlik bulunmuyor
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/create-event')}
        sx={{
          background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
          }
        }}
      >
        Yeni Etkinlik Oluştur
      </Button>
    </Box>
  );

  const renderEventCard = (event) => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '');
  
    const getImageUrl = (imageUrl) => {
      if (!imageUrl) return '';
      return imageUrl.startsWith('/api') ? `${baseUrl}${imageUrl.substring(4)}` : `${baseUrl}${imageUrl}`;
    };
  
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isEventCreator = event.creatorUsername === currentUser?.username;
  
    return (
    <Grid item xs={12} md={6} key={event.id}>
      <Card
        onClick={() => navigate(`/event/${event.eventId}`)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: (theme) => theme.palette.background.paper,
          boxShadow: 3,
          borderRadius: 3,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          }
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={event.imageUrl ? getImageUrl(event.imageUrl) : ''}
          alt={event.title}
          sx={{
            objectFit: 'cover',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}
        />

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={event.category}
                size="small"
                sx={{
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1E3A8A' : '#E0F2FE',
                  color: (theme) => theme.palette.mode === 'dark' ? '#93C5FD' : '#0284C7',
                  fontWeight: 500,
                }}
              />
              {event.moodTag && (
                <Chip
                  label={event.moodTag}
                  size="small"
                  sx={{
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1E3A8A' : '#E0F2FE',
                    color: (theme) => theme.palette.mode === 'dark' ? '#93C5FD' : '#0284C7',
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>

            {isEventCreator && (
              <IconButton
                size="small"
                onClick={(e) => handleDeleteEvent(e, event.eventId)}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.light',
                    color: 'error.dark',
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            {event.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {event.description.length > 100
              ? `${event.description.substring(0, 100)}...`
              : event.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {format(new Date(event.startTime), 'PPp', { locale: tr })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {event.address}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              👥 {event.currentAttendees}/{event.maxAttendees} katılımcı
            </Typography>
            <Button
              size="small"
              variant="contained"
              disabled={event.currentAttendees >= event.maxAttendees}
              onClick={() => handleJoinEvent(event.id)}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                background: (theme) =>
                  event.currentAttendees >= event.maxAttendees
                    ? theme.palette.grey[600]
                    : 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                '&:hover': {
                  background: (theme) =>
                    event.currentAttendees >= event.maxAttendees
                      ? theme.palette.grey[700]
                      : 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                },
              }}
            >
              {event.currentAttendees >= event.maxAttendees ? 'Dolu' : 'Katıl'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

  const renderEventsByDate = () => {
    if (Object.keys(filteredGroupedEvents).length === 0) {
      return <NoEventsFound />;
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    const sortedDates = Object.keys(filteredGroupedEvents).sort();

    return (
      <>
        {/* Bugünün eventleri */}
        {filteredGroupedEvents[today] && (
          <Box sx={{ mb: 6 }}>
           <Typography variant="h5" sx={(theme) => ({ 
  fontWeight: 600, 
  color: theme.palette.text.primary,
  mb: 3,
  display: 'flex',
  alignItems: 'center',
  gap: 1
})}>
              <CalendarIcon sx={(theme) => ({ color: theme.palette.primary.main })} />

              Bugünün Etkinlikleri
            </Typography>
            <Grid container spacing={3}>
              {filteredGroupedEvents[today].map(event => renderEventCard(event))}
            </Grid>
          </Box>
        )}

        {/* Diğer günlerin eventleri */}
        {sortedDates
          .filter(date => date !== today)
          .map(date => (
            <Box key={date} sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                color: '#0F172A', 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <CalendarIcon sx={{ color: '#94A3B8' }} />
                {format(parseISO(date), 'd MMMM yyyy', { locale: tr })}
              </Typography>
              <Grid container spacing={3}>
                {filteredGroupedEvents[date].map(event => renderEventCard(event))}
              </Grid>
            </Box>
          ))}
      </>
    );
  };

  return (
    <Box sx={(theme) => ({ py: 4, bgcolor: theme.palette.background.default })}>
      <Container maxWidth="lg">
        {/* Hero Section */}
      <Box sx={(theme) => ({ 
  textAlign: 'center', 
  mb: 8,
  p: 6,
  borderRadius: 4,
  color: theme.palette.text.primary,
  bgcolor: theme.palette.background.paper
})}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            mb: 2,
          }}>
            Hoş geldiniz, {currentUser?.username || 'Misafir'}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Yeni deneyimler ve arkadaşlıklar için etkinlikleri keşfedin
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Sol Taraf - Etkinlikler */}
          <Grid item xs={12} md={8}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : (
              renderEventsByDate()
            )}
          </Grid>

          {/* Sağ Taraf - Takvim ve Filtreler */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              p: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,

              borderRadius: 2,
              bgcolor: (theme) => theme.palette.background.paper,
              mb: 3
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Etkinlik Takvimi
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
   <DateCalendar
  value={selectedDate}
  onChange={(newValue) => setSelectedDate(newValue)}
  sx={(theme) => ({
    width: '100%',
    bgcolor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: 2,
    p: 1,
    '& .MuiPickersDay-root': {
      fontSize: '0.9rem',
      color: theme.palette.text.primary,
      '&.Mui-selected': {
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          bgcolor: theme.palette.primary.dark,
        },
      },
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.text.primary, // ← ok ikonlarını tema ile eşle
    },
    '& .MuiPickersCalendarHeader-label': {
      color: theme.palette.text.primary, // ← Ay/Yıl metni
    },
    '& .MuiTypography-root': {
      color: theme.palette.text.primary, // ← Gün isimleri
    },
  })}
/>
              </LocalizationProvider>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 