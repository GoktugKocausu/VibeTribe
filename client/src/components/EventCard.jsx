import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.eventId}`);
  };

  return (
    <Card sx={{ maxWidth: 345, borderRadius: 3, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="180"
        image={
          event.imageUrl
            ? `http://localhost:8080${event.imageUrl}`
            : "https://source.unsplash.com/random?event"
        }
        alt={event.title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {event.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: "gray" }} />
          <Typography variant="body2" color="text.secondary">
            {new Date(event.startTime).toLocaleDateString("tr-TR")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "gray" }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {event.address || "Bilinmeyen adres"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Avatar
            src={
              event.creatorProfilePicture
                ? `http://localhost:8080/api/users/profile-picture/${event.creatorProfilePicture}`
                : ""
            }
            sx={{ width: 32, height: 32, mr: 1 }}
          >
            {event.creatorName?.[0] || "?"}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {event.creatorName} {event.creatorSurname}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleClick}>
          Detaylar
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
