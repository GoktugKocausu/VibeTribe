import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Grid,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import eventService from "../services/eventService";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

const SavedEvents = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const response = await eventService.getSavedEvents();
        setSavedEvents(response);
      } catch (err) {
        setError("Kaydedilen etkinlikler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  const renderEventCard = (event) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const isEventCreator = event.creatorUsername === currentUser?.username;

    return (
      <Grid item xs={12} sm={6} md={4} key={event.eventId}>
        <Card
          onClick={() => navigate(`/event/${event.eventId}`)}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            "&:hover": {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-2px)",
              transition: "all 0.2s ease-in-out",
            },
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={
              event.imageUrl ? `http://localhost:8080${event.imageUrl}` : ""
            }
            alt={event.title}
            onError={(e) => {
              e.target.src = "";
            }}
            sx={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Chip
                    label={event.category}
                    size="small"
                    sx={{
                      bgcolor: "#E0F2FE",
                      color: "#0284C7",
                      fontWeight: 500,
                      mb: 1,
                      mr: 1,
                    }}
                  />
                </Box>
                {isEventCreator && (
                  <IconButton
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      color: "error.main",
                      "&:hover": {
                        bgcolor: "error.light",
                        color: "error.dark",
                      },
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

            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(event.startTime), "PPp", { locale: tr })}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  {event.address}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              👥 {event.currentAttendees}/{event.maxAttendees} katılımcı
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Kaydedilen Etkinlikler
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && savedEvents.length === 0 && (
        <Typography variant="body1" sx={{ mt: 4 }}>
          Henüz hiçbir etkinlik kaydetmediniz.
        </Typography>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {savedEvents.map((event) => renderEventCard(event))}
      </Grid>
    </Container>
  );
};

export default SavedEvents;
