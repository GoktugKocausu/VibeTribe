import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Modal,
  TextField,
  Stack,
  AvatarGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  CalendarToday,
  LocationOn,
  Person,
  Share,
  BookmarkBorder,
  AccessTime,
  Group,
  Edit as EditIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import eventService from "../services/eventService";
import EventChat from "../components/EventChat";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    startTime: null,
    endTime: null,
    maxAttendees: "",
    address: "",
    category: "",
    cost: "",
  });
  const [attendees, setAttendees] = useState([]);
  const [isAttending, setIsAttending] = useState(false);

  // Kullanıcının etkinlik sahibi olup olmadığını kontrol et
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isEventCreator = event?.creatorUsername === currentUser?.username;

  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEventById(id);
        setEvent(data);
        // Fetch attendees
        const attendeesData = await eventService.getEventAttendees(id);
        setAttendees(attendeesData);
     
        // Check if current user is attending
        setIsAttending(
          attendeesData.some(
            (attendee) => attendee.username === currentUser?.username
          )
        );

        // Edit form verilerini doldur
        setEditFormData({
          title: data.title,
          description: data.description,
          startTime: dayjs(data.startTime),
          endTime: dayjs(data.startTime).add(1, 'hour'),
          maxAttendees: data.maxAttendees,
          address: data.address,
          category: data.category,
          cost: data.cost || "",
        });
      } catch (err) {
        setError("Etkinlik detayları yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadEventDetails();
  }, [id]);

  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
                       console.log("safasg",editFormData);
      // Tarihleri backend'in beklediği formata dönüştür
      const formattedData = {
        ...editFormData,
        startTime: editFormData.startTime.format("YYYY-MM-DDTHH:mm:ss"),
        endTime: editFormData.endTime.format("YYYY-MM-DDTHH:mm:ss"),
        maxAttendees: parseInt(editFormData.maxAttendees),

        
        cost: editFormData.cost === "" ? null : parseFloat(editFormData.cost),
      };

      await eventService.updateEvent(id, formattedData);
      setIsEditModalOpen(false);

      // Güncel verileri yükle
      const data = await eventService.getEventById(id);
      setEvent(data);
      const attendeesData = await eventService.getEventAttendees(id);
      setAttendees(attendeesData);
      setIsAttending(
        attendeesData.some(
          (attendee) => attendee.username === currentUser?.username
        )
      );
    } catch (err) {
      setError("Etkinlik güncellenirken bir hata oluştu");
    }
  };

  // Modal style
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "600px" },
    maxHeight: "90vh",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    overflow: "auto",
  };

  const handleJoinEvent = async () => {
    try {
      await eventService.joinEvent(id);
      const data = await eventService.getEventById(id);
      setEvent(data);
      const attendeesData = await eventService.getEventAttendees(id);
      setAttendees(attendeesData);
      setIsAttending(true);
    } catch (err) {
      setError("Etkinliğe katılırken bir hata oluştu");
    }
  };

  const handleLeaveEvent = async () => {
    try {
      await eventService.leaveEvent(id);
      const data = await eventService.getEventById(id);
      setEvent(data);
      const attendeesData = await eventService.getEventAttendees(id);
      setAttendees(attendeesData);
      setIsAttending(false);
    } catch (err) {
      setError("Etkinlikten ayrılırken bir hata oluştu");
    }
  };

  const handleDeleteEvent = async () => {
    if (
      window.confirm(
        "Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      )
    ) {
      try {
        await eventService.deleteEvent(id);
        navigate("/"); // Ana sayfaya yönlendir
      } catch (err) {
        setError("Etkinlik silinirken bir hata oluştu");
      }
    }
  };

  // Add this component for Attendees List Modal
  const AttendeesListModal = ({ open, handleClose, attendees }) => {
    const navigate = useNavigate();

    const handleProfileClick = (username) => {
      navigate(`/profile/${username}`);
      handleClose();
    };

    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="attendees-list-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "400px" },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Katılımcılar</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {attendees.map((attendee) => (
              <ListItem
                key={attendee.username}
                button
                onClick={() => handleProfileClick(attendee.username)}
                sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" } }}
              >
                <ListItemAvatar>
                  <Avatar src={attendee.profilePicture}>
                    {attendee.name?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${attendee.name} ${attendee.surname}`}
                  secondary={attendee.username}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    );
  };

  const [showAttendees, setShowAttendees] = useState(false);
   const isAttendee = attendees.some(user => user.username === currentUser.username);
const isCreator = event?.creatorUsername === currentUser.username;
const canSeeChat = isAttendee || isCreator;
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!event) return null;

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Hero Section with Event Image */}
        <Paper
          sx={{
            position: "relative",
            mb: 6,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            component="img"
            src={
              event.imageUrl
                ? `http://localhost:8080${event.imageUrl}`
                : "https://source.unsplash.com/random?event"
            }
            alt={event.title}
            sx={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
            }}
          />

          {/* Overlay gradient */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
              p: 4,
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                {event.title}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Chip
                  label={event.category}
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                />
                <Chip
                  label={event.moodTag}
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                />
              </Box>
            </Box>
            {isEventCreator && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditModalOpen(true)}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  Düzenle
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteEvent}
                  sx={{
                    bgcolor: "rgba(255,0,0,0.6)",
                    "&:hover": {
                      bgcolor: "rgba(255,0,0,0.8)",
                    },
                  }}
                >
                  Sil
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

      <Grid container spacing={4}>
  {/* Main Content */}
  <Grid item xs={12} md={8}>
    <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Etkinlik Detayları
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8 }}
      >
        {event.description}
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* === INNER GRID === */}
      <Grid container spacing={3}>
        {/* Başlangıç Tarihi */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <CalendarToday sx={{ color: '#0EA5E9' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Başlangıç Tarihi</Typography>
              <Typography variant="body1">
                {format(new Date(event.startTime), 'PPP', { locale: tr })}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Bitiş Tarihi */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <CalendarToday sx={{ color: '#0EA5E9' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Bitiş Tarihi</Typography>
              <Typography variant="body1">
                {format(new Date(event.endTime), 'PPP', { locale: tr })}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Başlangıç Saati */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AccessTime sx={{ color: '#0EA5E9' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Başlangıç Saati</Typography>
              <Typography variant="body1">
                {format(new Date(event.startTime), 'HH:mm', { locale: tr })}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Bitiş Saati */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AccessTime sx={{ color: '#0EA5E9' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Bitiş Saati</Typography>
              <Typography variant="body1">
                {format(new Date(event.endTime), 'HH:mm', { locale: tr })}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Konum */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <LocationOn sx={{ color: '#0EA5E9' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Konum</Typography>
              <Typography variant="body1">{event.address}</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Katılım Ücreti */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Person sx={{ color: '#0EA5E9' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Katılım Ücreti</Typography>
              <Typography variant="body1">
                {event.cost && event.cost > 0 ? `${event.cost} ₺` : 'Belirtilmemiş'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* === END INNER GRID === */}
    </Paper>
    {canSeeChat && (
  <EventChat eventId={id} currentUser={currentUser} />
)}

{!canSeeChat && (
  <Paper sx={{ p: 3, mt: 3 }}>
    <Typography color="text.secondary">
      Etkinlik sohbetine katılmak için önce etkinliğe katılmalısınız.
    </Typography>
  </Paper>
)}
  </Grid>

    

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Event Creator Card */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Etkinlik Sahibi
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Avatar
                  src={event.creatorProfilePicture}
                  sx={{ width: 56, height: 56 }}
                >
                  {event.creatorName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {event.creatorName} {event.creatorSurname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.creatorUsername}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Updated Attendees Card */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Katılımcılar</Typography>
                <Typography variant="body2" color="text.secondary">
                  {event?.currentAttendees}/{event?.maxAttendees}
                </Typography>
              </Box>

              {attendees.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <AvatarGroup
                    max={5}
                    sx={{
                      justifyContent: "flex-start",
                      mb: 1,
                      "& .MuiAvatar-root": {
                        width: 40,
                        height: 40,
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
                      },
                    }}
                  >
                    {attendees.map((attendee) => (
                      <Avatar
                        key={attendee.username}
                        src={attendee.profilePicture}
                        alt={attendee.name}
                        onClick={() =>
                          navigate(`/profile/${attendee.username}`)
                        }
                        sx={{ cursor: "pointer" }}
                      >
                        {attendee.name?.[0]}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => setShowAttendees(true)}
                  >
                    Tüm katılımcıları gör
                  </Typography>
                </Box>
              )}

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Group sx={{ color: "#0EA5E9" }} />
                <Typography variant="body2" color="text.secondary">
                  {event?.maxAttendees - event?.currentAttendees} kişilik yer
                  kaldı
                </Typography>
              </Box>

              {!isEventCreator ? (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={isAttending ? handleLeaveEvent : handleJoinEvent}
                  disabled={
                    event?.currentAttendees >= event?.maxAttendees &&
                    !isAttending
                  }
                  sx={{
                    background: isAttending
                      ? "linear-gradient(135deg, #EF4444 0%, #F87171 100%)"
                      : "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
                    "&:hover": {
                      background: isAttending
                        ? "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)"
                        : "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)",
                    },
                    py: 1.5,
                  }}
                >
                  {isAttending
                    ? "Ayrıl"
                    : event?.currentAttendees >= event?.maxAttendees
                    ? "Etkinlik Dolu"
                    : "Katıl"}
                </Button>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  Bu etkinliğin sahibisiniz
                </Typography>
              )}
            </Paper>

            {/* Share and Save Buttons */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Share />}
                sx={{ mb: 2 }}
              >
                Etkinliği Paylaş
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<BookmarkBorder />}
              >
                Kaydet
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Edit Modal */}
        <Modal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          aria-labelledby="edit-event-modal"
        >
          <Box sx={modalStyle}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" component="h2">
                Etkinliği Düzenle
              </Typography>
              <IconButton onClick={() => setIsEditModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <form onSubmit={handleEditSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Başlık"
                  fullWidth
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                />

                <TextField
                  label="Açıklama"
                  fullWidth
                  multiline
                  rows={4}
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                />

                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="tr"
                >
                  <DateTimePicker
                    label="Başlangıç Zamanı"
                    value={editFormData.startTime}
                    onChange={(newValue) =>
                      setEditFormData({ ...editFormData, startTime: newValue })
                    }
                    format="DD/MM/YYYY HH:mm"
                  />

                  <DateTimePicker
                    label="Bitiş Zamanı"
                    value={editFormData.endTime}
                    onChange={(newValue) =>
                      setEditFormData({ ...editFormData, endTime: newValue })
                    }
                    format="DD/MM/YYYY HH:mm"
                  />
                </LocalizationProvider>

                <TextField
                  label="Maksimum Katılımcı Sayısı"
                  type="number"
                  fullWidth
                  value={editFormData.maxAttendees}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      maxAttendees: e.target.value,
                    })
                  }
                />

                <TextField
  label="Katılım Ücreti (₺)"
  type="number"
  fullWidth
  value={editFormData.cost}
  onChange={(e) =>
    setEditFormData({
      ...editFormData,
      cost: e.target.value,
    })
  }
/>
        

                <TextField
                  label="Adres"
                  fullWidth
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      address: e.target.value,
                    })
                  }
                />

                <TextField
                  label="Kategori"
                  fullWidth
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      category: e.target.value,
                    })
                  }
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "flex-end",
                    mt: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)",
                      },
                    }}
                  >
                    Kaydet
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Modal>
      </Container>

      {/* Add Attendees List Modal */}
      <AttendeesListModal
        open={showAttendees}
        handleClose={() => setShowAttendees(false)}
        attendees={attendees}
      />
    </Box>
  );
};

export default EventDetails;
