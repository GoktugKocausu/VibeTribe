import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Modal,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Tooltip,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Event as EventIcon,
  EmojiEvents as TrophyIcon,
  Group as GroupIcon,
  Favorite as InterestIcon,
  Star as ReputationIcon,
  ThumbUp as ThumbUpIcon,
  Check as CheckIcon,          // ← EKLE
  PersonAdd as PersonAddIcon   // ← EKLE
} from '@mui/icons-material';
import friendService from "../services/friendService";
import userService from "../services/userService";
import { useUser } from "../contexts/UserContext";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reputationModalOpen, setReputationModalOpen] = useState(false);
  const [reputationForm, setReputationForm] = useState({
    points: 5,
    reason: "",
  });
  const [reputationHistory, setReputationHistory] = useState([]);
  const [editForm, setEditForm] = useState({
    bio: "",
    age: "",
    preferredMood: "",
    name: "",
    surname: "",
  });
  const [stats, setStats] = useState({
    hostedEvents: 0,
    friends: 0,
    reputation: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'error', 'warning', 'info', 'success'
  });
  const [hasGivenReputation, setHasGivenReputation] = useState(false);
  const [reputationHistoryModalOpen, setReputationHistoryModalOpen] =
    useState(false);
  const [friendStatus, setFriendStatus] = useState({
    areFriends: false,
    isPending: false,
  });

  useEffect(() => {
    if (username !== currentUser?.username) {
      const checkFriendStatus = async () => {
        try {
          const [areFriends, isPending] = await Promise.all([
            friendService.areFriends(username),
            friendService.isFriendRequestPending(username),
          ]);
          setFriendStatus({ areFriends, isPending });
        } catch (err) {
          console.error("Error checking friend status:", err);
        }
      };
      checkFriendStatus();
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!username) {
          setError("Kullanıcı adı bulunamadı");
          return;
        }

        // Tüm API çağrılarını paralel olarak yap
        const [userProfile, history, userStats] = await Promise.all([
          userService.getUserProfile(username),
          userService.getReputationHistory(username),
          userService.getUserStats(username),
        ]);

        setProfileUser(userProfile);
        setReputationHistory(history);
        setStats(userStats);

        // Check if current user has already given reputation
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser && history) {
          const hasGiven = history.some(
            (rep) => rep.awardedByUsername === currentUser.username
          );
          setHasGivenReputation(hasGiven);
        }

        // Sadece kendi profilimizi görüntülüyorsak ve ilk yüklemede context'i güncelle
        if (username === currentUser?.username && !profileUser) {
          updateUser({
            ...currentUser,
            ...userProfile,
          });
        }

        setEditForm({
          bio: userProfile.bio || "",
          age: userProfile.age || "",
          preferredMood: userProfile.preferredMood || "",
          name: userProfile.name || "",
          surname: userProfile.surname || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Profil bilgileri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleProfileUpdate = async () => {
    setEditModalOpen(true);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFormSubmit = async () => {
    try {
      const updatedUser = await userService.updateUserProfile(
        profileUser.username,
        editForm
      );

      // Profil bilgilerini güncelle
      setProfileUser((prev) => ({
        ...prev,
        ...editForm,
      }));

      // Context'i güncelle
      updateUser({
        ...editForm,
      });

      setEditModalOpen(false);
      showNotification("Profil başarıyla güncellendi", "success");
    } catch (err) {
      setError(err.message || "Profil güncellenirken bir hata oluştu");
      showNotification("Profil güncellenirken bir hata oluştu", "error");
    }
  };

  const handleProfilePictureUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      // Dosya tipi kontrolü
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
      ];
      if (!validTypes.includes(file.type)) {
        showNotification(
          "Lütfen geçerli bir görsel formatı seçin (JPEG, PNG, GIF, WEBP, BMP)",
          "error"
        );
        return;
      }

      // Dosya boyutu kontrolü (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showNotification("Görsel boyutu 5MB'dan küçük olmalıdır", "error");
        return;
      }

      const response = await userService.uploadProfilePicture(file);

      // Profil fotoğrafını güncelle
      setProfileUser((prev) => ({
        ...prev,
        profilePicture: response.profilePicture,
      }));

      // Context'i güncelle
      updateUser({
        profilePicture: response.profilePicture,
      });

      // Profil bilgilerini yeniden yükle
      const updatedProfile = await userService.getUserProfile(username);
      setProfileUser(updatedProfile);

      showNotification("Profil fotoğrafı başarıyla güncellendi", "success");
    } catch (err) {
      setError(err.message || "Profil fotoğrafı yüklenirken bir hata oluştu");
      showNotification("Profil fotoğrafı yüklenirken bir hata oluştu", "error");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleReputationSubmit = async () => {
    // Client-side validation
    if (!reputationForm.reason || reputationForm.reason.trim() === "") {
      showNotification(
        "Lütfen reputation puanı verme sebebinizi yazın.",
        "error"
      );
      return;
    }

    try {
      await userService.giveReputation(
        profileUser.username,
        reputationForm.points,
        reputationForm.reason
      );
      // Refresh user stats after giving reputation
      const userStats = await userService.getUserStats(profileUser.username);
      setStats(userStats);
      const history = await userService.getReputationHistory(
        profileUser.username
      );
      setReputationHistory(history);
      setReputationModalOpen(false);
      setReputationForm({ points: 5, reason: "" });
      showNotification("Reputation puanı başarıyla verildi!", "success");
    } catch (error) {
      console.error("Backend error:", error);
      let errorMessage;

      // Check if the error message is directly in error.message
      const backendMessage = error.message;

      switch (backendMessage) {
        case "You have already given reputation points to this user":
          errorMessage = "Bu kullanıcıya zaten reputation puanı vermişsiniz.";
          break;
        case "Cannot give reputation to yourself":
          errorMessage = "Kendinize reputation puanı veremezsiniz.";
          break;
        case "Reputation points must be between 1 and 10":
          errorMessage = "Reputation puanı 1 ile 10 arasında olmalıdır.";
          break;
        case "Reason is required":
          errorMessage = "Lütfen reputation puanı verme sebebinizi yazın.";
          break;
        case "User not found":
          errorMessage = "Kullanıcı bulunamadı.";
          break;
        default:
          errorMessage =
            backendMessage ||
            "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      }
      showNotification(errorMessage, "error");
    }
  };

  // Profil düzenleme butonunu sadece kendi profilimizde göster
  const isOwnProfile = currentUser?.username === username;

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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profil Başlığı */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
          color: "white",
          position: "relative",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="profile-picture-input"
              onChange={handleProfilePictureUpload}
              disabled={!isOwnProfile}
            />
            <label htmlFor="profile-picture-input">
              <Avatar
                src={
                  profileUser?.profilePicture
                    ? `http://localhost:8080/users/profile-picture/${profileUser.profilePicture}`
                    : null
                }
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "#0284C7",
                  fontSize: "3rem",
                  border: "4px solid white",
                  cursor: isOwnProfile ? "pointer" : "default",
                  "&:hover": isOwnProfile
                    ? {
                        opacity: 0.9,
                      }
                    : {},
                }}
              >
                {profileUser?.username
                  ? profileUser.username[0].toUpperCase()
                  : "?"}
              </Avatar>
            </label>
          </Grid>
          <Grid item xs={12} sm>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {profileUser?.name} {profileUser?.surname}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.9 }}>
              @{profileUser?.username}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              {profileUser?.bio || "Henüz bir bio eklenmemiş"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<EventIcon sx={{ color: "white !important" }} />}
                label={`${stats.hostedEvents} Etkinlik`}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
              <Chip
                icon={<GroupIcon sx={{ color: "white !important" }} />}
                label={`${stats.friends} Arkadaş`}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
              <Chip
                icon={<ReputationIcon sx={{ color: "white !important" }} />}
                label={`${stats.reputation || 0} Rep. Puanı`}
                onClick={() => setReputationHistoryModalOpen(true)}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid item>
            {isOwnProfile ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleProfileUpdate}
                sx={{
                  bgcolor: "#F8FAFC",
                  color: "white",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  "&:hover": {
                    bgcolor: "#F1F5F9",
                  },
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  mr: 2,
                }}
              >
                Profili Düzenle
              </Button>
            ) : (
              <Tooltip
                title={
                  hasGivenReputation
                    ? "Bu kullanıcıya zaten reputation puanı vermişsiniz"
                    : "Reputation Ver"
                }
              >
                <span>
                  <Button
                    variant="contained"
                    startIcon={<ThumbUpIcon />}
                    onClick={() => setReputationModalOpen(true)}
                    disabled={hasGivenReputation}
                    sx={{
                      bgcolor: "#F8FAFC",
                      color: "white",
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      "&:hover": {
                        bgcolor: "#F1F5F9",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#E2E8F0",
                        color: "white",
                      },
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  ></Button>
                </span>
              </Tooltip>
            )}
          </Grid>
          <Grid item>
  {!isOwnProfile && (
    friendStatus.areFriends ? (
      <Chip 
        icon={<CheckIcon />} 
        label="Arkadaşsınız" 
        color="success" 
        sx={{ fontWeight: 600 }} 
      />
    ) : friendStatus.isPending ? (
      <Chip 
        label="İstek Beklemede" 
        color="warning"
        sx={{ fontWeight: 600 }} 
      />
    ) : (
      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        onClick={async () => {
          try {
            await friendService.sendFriendRequest(username);
            setFriendStatus({ areFriends: false, isPending: true });
            showNotification('Arkadaşlık isteği gönderildi', 'success');
          } catch (err) {
            showNotification('İstek gönderilemedi', 'error');
          }
        }}
        sx={{
          bgcolor: '#F8FAFC',
          color: 'white',
          fontWeight: 600,
          px: 3,
          py: 1,
          '&:hover': {
            bgcolor: '#F1F5F9',
          }
        }}
      >
        Arkadaşlık İsteği Gönder
      </Button>
    )
  )}
</Grid>

        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Sol Kolon - Kişisel Bilgiler */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Kişisel Bilgiler
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Yaş"
                  secondary={profileUser?.age || "Belirtilmemiş"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InterestIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="İlgi Alanları"
                  secondary={
                    profileUser?.interests?.length > 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        {profileUser.interests.map((interest, index) => (
                          <Chip
                            key={index}
                            label={interest}
                            size="small"
                            sx={{
                              bgcolor: "#E0F2FE",
                              color: "#0284C7",
                              fontSize: "0.75rem",
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      "Henüz ilgi alanı eklenmemiş"
                    )
                  }
                  secondaryTypographyProps={{
                    component: "div",
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrophyIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Tercih Edilen Mood"
                  secondary={profileUser?.preferredMood || "Belirtilmemiş"}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Sağ Kolon - Etkinlikler */}
        <Grid item xs={12} md={8}>
          {/* Son Etkinlikler */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Son Etkinlikler
            </Typography>
            <Grid container spacing={2}>
              {/* TODO: Son etkinlikleri listele */}
              <Grid item xs={12}>
                <Typography color="text.secondary" textAlign="center">
                  Henüz etkinlik yok
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #E2E8F0",
            fontWeight: 600,
          }}
        >
          Profili Düzenle
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ad"
                name="name"
                value={editForm.name}
                onChange={handleEditFormChange}
                placeholder="Adınız"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Soyad"
                name="surname"
                value={editForm.surname}
                onChange={handleEditFormChange}
                placeholder="Soyadınız"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={editForm.bio}
                onChange={handleEditFormChange}
                multiline
                rows={4}
                placeholder="Kendinizden bahsedin..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Yaş"
                name="age"
                type="number"
                value={editForm.age}
                onChange={handleEditFormChange}
                inputProps={{ min: 18, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tercih Edilen Mood"
                name="preferredMood"
                value={editForm.preferredMood}
                onChange={handleEditFormChange}
                placeholder="Örn: Enerjik, Sakin, Eğlenceli"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #E2E8F0" }}>
          <Button
            onClick={() => setEditModalOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleEditFormSubmit}
            sx={{
              bgcolor: "#0EA5E9",
              "&:hover": {
                bgcolor: "#0284C7",
              },
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reputation Modal */}
      <Dialog
        open={reputationModalOpen}
        onClose={() => setReputationModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #E2E8F0",
            fontWeight: 600,
          }}
        >
          Reputation Ver
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}>
            <Typography>Puan (1-10)</Typography>
            <Rating
              value={reputationForm.points}
              onChange={(event, newValue) => {
                setReputationForm((prev) => ({ ...prev, points: newValue }));
              }}
              max={10}
            />
            <TextField
              fullWidth
              label="Açıklama"
              name="reason"
              value={reputationForm.reason}
              onChange={(e) =>
                setReputationForm((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              multiline
              rows={4}
              placeholder="Neden bu puanı veriyorsunuz?"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #E2E8F0" }}>
          <Button
            onClick={() => setReputationModalOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleReputationSubmit}
            sx={{
              bgcolor: "#0EA5E9",
              "&:hover": {
                bgcolor: "#0284C7",
              },
            }}
          >
            Gönder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reputation History Modal */}
      <Dialog
        open={reputationHistoryModalOpen}
        onClose={() => setReputationHistoryModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #E2E8F0",
            fontWeight: 600,
          }}
        >
          Reputation Geçmişi
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {reputationHistory.length > 0 ? (
            <List>
              {reputationHistory.map((rep, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: "#0EA5E9" }}>
                        {rep.awardedByUsername
                          ? rep.awardedByUsername[0].toUpperCase()
                          : "?"}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            component="span"
                            variant="subtitle1"
                            fontWeight="bold"
                          >
                            {rep.awardedByUsername}
                          </Typography>
                          <Rating
                            value={rep.points}
                            readOnly
                            max={10}
                            size="small"
                          />
                          <Typography component="span" color="text.secondary">
                            ({rep.points} puan)
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {rep.reason}
                          </Typography>
                          <Typography
                            component="div"
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {(() => {
                              try {
                                const date = new Date(rep.timestamp);
                                if (isNaN(date.getTime())) {
                                  return "Tarih bilgisi mevcut değil";
                                }
                                return date
                                  .toLocaleDateString("tr-TR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  .replace(":", ".");
                              } catch (error) {
                                console.error("Date parsing error:", error);
                                return "Tarih bilgisi mevcut değil";
                              }
                            })()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < reputationHistory.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography
              color="text.secondary"
              textAlign="center"
              sx={{ py: 3 }}
            >
              Henüz reputation puanı verilmemiş
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #E2E8F0" }}>
          <Button
            onClick={() => setReputationHistoryModalOpen(false)}
            variant="contained"
            sx={{
              bgcolor: "#0EA5E9",
              "&:hover": {
                bgcolor: "#0284C7",
              },
            }}
          >
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
