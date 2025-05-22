// src/pages/Settings.jsx
import React from "react";
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
  // Gelecekte buraya toggle'lar, kullanıcı ayarları, vs. eklenebilir
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Ayarlar
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Karanlık Mod (simülasyon)"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleLogout}
          >
            Çıkış Yap
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;
