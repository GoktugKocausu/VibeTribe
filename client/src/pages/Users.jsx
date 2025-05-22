import { useState, useEffect } from "react";
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
  Chip,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Star as ReputationIcon,
} from "@mui/icons-material";
import DoneIcon from "@mui/icons-material/Done"; // ✅ Gerekli import
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import friendService from "../services/friendService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState("friends");
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await userService.searchUsers();
      const friendArray = Array.isArray(response) ? response : [];
      setFriendsList(friendArray);
      setUsers(friendArray);
      setMode("friends");
      setError("");

      const pending = await friendService.getPendingRequests();
      setPendingRequests(pending.map((req) => req.recipient.username));
    } catch (err) {
      setError(err.message || "Kullanıcılar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const searchAllUsers = async (query = "") => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const response = await userService.searchAllUsers(
        query,
        currentUser?.username
      );
      setUsers(Array.isArray(response.content) ? response.content : []);
      setMode("search");
      setError("");
    } catch (err) {
      setError(err.message || "Kullanıcılar aranamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (mode === "friends") {
      const filtered = friendsList.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.name?.toLowerCase().includes(query.toLowerCase()) ||
          user.surname?.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filtered);
    }
  };

  const handleSearchButton = () => {
    if (searchQuery.trim() !== "") searchAllUsers(searchQuery);
  };

  const handleGoBack = () => {
    setSearchQuery("");
    setUsers(friendsList);
    setMode("friends");
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          {mode === "friends"
            ? "Arkadaşlar"
            : `“${searchQuery}” için Arama Sonuçları`}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Kullanıcı ara..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleSearchButton}
            sx={{
              background: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)",
              },
            }}
          >
            Ara
          </Button>
          {mode === "search" && (
            <Button variant="outlined" onClick={handleGoBack}>
              Geri
            </Button>
          )}
        </Box>
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
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={
                        user.profilePicture
                          ? `${process.env.REACT_APP_API_BASE_URL}/users/profile-picture/${user.profilePicture}`
                          : null
                      }
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {user.bio || "Henüz bir bio eklenmemiş"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      icon={<TrophyIcon />}
                      label={`${user.hostedEvents || 0} Etkinlik`}
                      size="small"
                      sx={{ bgcolor: "#E0F2FE", color: "#0284C7" }}
                    />
                    <Chip
                      icon={<ReputationIcon />}
                      label={`${user.reputationPoints || 0} Rep.`}
                      size="small"
                      sx={{ bgcolor: "#E0F2FE", color: "#0284C7" }}
                    />
                  </Box>

                  {/* ✅ Yalnızca arkadaş modundaysa mesaj butonunu göster */}
                  {mode === "friends" && (
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/friends?selectedUser=${user.username}`);
                        }}
                        sx={{
                          textTransform: "none",
                          background:
                            "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #16a34a 0%, #4ade80 100%)",
                          },
                        }}
                      >
                        Mesaj
                      </Button>
                    </Box>
                  )}

                  {mode === "search" && (
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {friendsList.some((f) => f.username === user.username) ? (
                        <Chip
                          label="Arkadaşsınız"
                          color="success"
                          icon={<DoneIcon />}
                        />
                      ) : pendingRequests.includes(user.username) ||
                        requestedUsers.includes(user.username) ? (
                        <Button variant="outlined" size="small" disabled>
                          İstek Gönderildi
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await friendService.sendFriendRequest(
                                user.username
                              );
                              setRequestedUsers([
                                ...requestedUsers,
                                user.username,
                              ]);
                              showSnackbar(
                                "Arkadaşlık isteği gönderildi",
                                "success"
                              );
                            } catch (err) {
                              const errorMessage =
                                err.response?.data || err.message;
                              showSnackbar(
                                errorMessage === "User not found"
                                  ? "Kullanıcı bulunamadı"
                                  : errorMessage ===
                                    "Friend request already sent"
                                  ? "Zaten istek gönderdin"
                                  : errorMessage ===
                                    "Cannot send friend request to yourself"
                                  ? "Kendine istek atamazsın"
                                  : errorMessage === "Users are already friends"
                                  ? "Zaten arkadaşsınız"
                                  : "İstek gönderilemedi",
                                "error"
                              );
                            }
                          }}
                        >
                          Arkadaş Ekle
                        </Button>
                      )}
                    </Box>
                  )}
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
