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
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            '&:hover': {
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={event.imageUrl ? getImageUrl(event.imageUrl) : ''}
            alt={event.title}
            onError={(e) => {
              e.target.src = '';
            }}
            sx={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
  
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Chip
                    label={event.category}
                    size="small"
                    sx={{
                      bgcolor: '#E0F2FE',
                      color: '#0284C7',
                      fontWeight: 500,
                      mb: 1,
                      mr: 1
                    }}
                  />
                  <Chip
                    label={event.moodTag}
                    size="small"
                    sx={{
                      bgcolor: '#E0F2FE',
                      color: '#0284C7',
                      fontWeight: 500,
                      mb: 1
                    }}
                  />
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
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.description.length > 100
                  ? `${event.description.substring(0, 100)}...`
                  : event.description}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(event.startTime), 'PPp', { locale: tr })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  {event.address}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  👥 {event.currentAttendees}/{event.maxAttendees} katılımcı
                </Typography>
              </Box>
              <Box>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleJoinEvent(event.id)}
                  disabled={event.currentAttendees >= event.maxAttendees}
                  sx={{
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                    }
                  }}
                >
                  {event.currentAttendees >= event.maxAttendees ? 'Dolu' : 'Katıl'}
                </Button>
              </Box>
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
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              color: '#0F172A', 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <CalendarIcon sx={{ color: '#0EA5E9' }} />
              Bugünkü Etkinlikler
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
    <Box sx={{ py: 4, bgcolor: '#F8FAFC' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 8,
          p: 6,
          borderRadius: 4,
          color: 'black'
        }}>
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
              border: '1px solid #E2E8F0',
              borderRadius: 2,
              bgcolor: 'white',
              mb: 3
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Etkinlik Takvimi
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar 
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  sx={{
                    width: '100%',
                    '& .MuiPickersDay-root': {
                      fontSize: '0.9rem',
                      '&.Mui-selected': {
                        bgcolor: '#0EA5E9',
                        '&:hover': {
                          bgcolor: '#0284C7'
                        }
                      }
                    }
                  }}
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