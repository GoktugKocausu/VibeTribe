import React, { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";

const Settings = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" sx={(theme) => ({
        fontWeight: 700,
        mb: 3,
        color: theme.palette.text.primary
      })}>
        Ayarlar
      </Typography>

      <Paper
        elevation={3}
        sx={(theme) => ({
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[4],
        })}
      >
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={mode === "dark"}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label={`Karanlık Mod: ${mode === "dark" ? "Açık" : "Kapalı"}`}
          />
        </Box>

        <Divider sx={(theme) => ({
          my: 2,
          borderColor: theme.palette.divider
        })} />

        <Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogout}
            sx={{
              background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
              color: "#fff",
              '&:hover': {
                background: "linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)"
              }
            }}
          >
            Çıkış Yap
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;
