import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import api from "../services/axiosConfig";
import { useNavigate } from "react-router-dom";

const EventChat = ({ eventId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/events/${eventId}/chat`);
      setMessages(response.data);
    } catch (err) {
      setError("Mesajlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const response = await api.post(
        `/events/${eventId}/chat`,
        null,
        { params: { content: newMessage } }
      );
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (err) {
      setError("Mesaj gönderilemedi");
    } finally {
      setSending(false);
    }
  };
  

  useEffect(() => {
    fetchMessages();
  }, [eventId]);

  if (loading) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Etkinlik Sohbeti
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          maxHeight: "300px",
          overflowY: "auto",
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.map((msg) => {
          const isOwn = msg.sender.username === currentUser.username;
          return (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                alignSelf: isOwn ? "flex-end" : "flex-start",
                flexDirection: isOwn ? "row-reverse" : "row",
              }}
            >
              <Avatar
                src={msg.sender.profilePicture || ""}
                onClick={() => navigate(`/profile/${msg.sender.username}`)}
                sx={{ bgcolor: "primary.light", cursor: "pointer" }}
              >
                {msg.sender.name?.[0] || msg.sender.username?.[0]}
              </Avatar>

              <Box
                sx={{
                  backgroundColor: isOwn ? "#0EA5E9" : "#F3F4F6",
                  color: isOwn ? "#fff" : "#000",
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: "300px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, cursor: "pointer" }}
                  onClick={() => navigate(`/profile/${msg.sender.username}`)}
                >
                  {msg.sender.name} {msg.sender.surname}
                </Typography>
                <Typography variant="caption" color={isOwn ? "#BBDEFB" : "text.secondary"}>
                  @{msg.sender.username}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {msg.content}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Mesaj yaz..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={sending}
          sx={{
            background: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
          }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default EventChat;
