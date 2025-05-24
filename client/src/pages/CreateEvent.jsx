import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  IconButton,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import eventService from "../services/eventService";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ClearIcon from "@mui/icons-material/Clear";


dayjs.locale("tr");

const categories = [
  "Spor & Sağlık",
  "Sanat",
  "Müzik",
  "Eğitim",
  "Sosyal",
  "İş & Network",
  "Teknoloji",
  "Oyun",
  "Yemek & İçecek",
  "Doğa & Macera",
];

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    startTime: dayjs(),
    endTime: dayjs().add(1, "hour"),
    maxAttendees: "",
    category: "",
    cost: null,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Başlık gerekli";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Adres gerekli";
    }

    if (!formData.category) {
      newErrors.category = "Kategori gerekli";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Başlangıç zamanı gerekli";
    }

    if (!formData.endTime) {
      newErrors.endTime = "Bitiş zamanı gerekli";
    }

    if (
      formData.endTime &&
      formData.startTime &&
      formData.endTime <= formData.startTime
    ) {
      newErrors.endTime = "Bitiş zamanı başlangıç zamanından sonra olmalı";
    }

    if (!formData.maxAttendees || formData.maxAttendees < 1) {
      newErrors.maxAttendees = "Geçerli bir katılımcı sayısı girin";
    }
    if (formData.cost !== '' && Number(formData.cost) < 0) {
    newErrors.cost = 'Ücret 0₺ veya daha fazla olmalı';
    }
    if (!formData.image) {
  newErrors.image = "Etkinlik görseli seçilmelidir";
}

    return newErrors;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
      ];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image:
            "Lütfen geçerli bir görsel formatı seçin (JPEG, PNG, GIF, WEBP, BMP)",
        });
        return;
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors({
          ...errors,
          image: "Görsel boyutu 5MB'dan küçük olmalıdır",
        });
        return;
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setErrors({
        ...errors,
        image: null,
      });
    }
  };

  const clearImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Görsel kontrolü
      if (formData.image) {
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!validTypes.includes(formData.image.type)) {
          throw new Error(
            "Sadece JPEG/JPG, PNG, GIF ve WEBP formatları desteklenmektedir."
          );
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (formData.image.size > maxSize) {
          throw new Error("Görsel boyutu 5MB'dan küçük olmalıdır.");
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append('cost', formData.cost);
      formDataToSend.append("address", formData.address);
      formDataToSend.append(
        "startTime",
        formData.startTime.format("YYYY-MM-DDTHH:mm:ss")
      );
      formDataToSend.append(
        "endTime",
        formData.endTime.format("YYYY-MM-DDTHH:mm:ss")
      );
      formDataToSend.append("maxAttendees", formData.maxAttendees);
      formDataToSend.append("category", formData.category);

      if (formData.image) {
        // Görseli 'image' adıyla gönder
        formDataToSend.append("image", formData.image, formData.image.name);
      }

      await eventService.createEvent(formDataToSend);

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setErrors({
        submit: error.message || "Etkinlik oluşturulurken bir hata oluştu",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, bgcolor: (theme) => theme.palette.background.paper, p: { xs: 2, sm: 4 }, borderRadius: 2 }}>

        <Typography variant="h4" component="h1" gutterBottom>
          Yeni Etkinlik Oluştur
        </Typography>

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Etkinlik başarıyla oluşturuldu! Yönlendiriliyorsunuz...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Etkinlik Başlığı"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                error={Boolean(errors.title)}
                helperText={errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Etkinlik Açıklaması"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                error={Boolean(errors.description)}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Etkinlik Adresi"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                error={Boolean(errors.address)}
                helperText={errors.address}
              />
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Başlangıç Zamanı"
                  value={formData.startTime}
                  onChange={(value) =>
                    setFormData({ ...formData, startTime: value,endTime: value.add(1, 'hour'), })
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(errors.startTime),
                      helperText: errors.startTime,
                      
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Bitiş Zamanı"
                  value={formData.endTime}
                  onChange={(value) =>
                    setFormData({ ...formData, endTime: value })
                  }
                 minDateTime={formData.startTime.add(1, 'hour')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(errors.endTime),
                      helperText: errors.endTime,
                    },
                  }}
                />
              </Grid>
            </LocalizationProvider>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="maxAttendees"
                name="maxAttendees"
                label="Maksimum Katılımcı Sayısı"
                type="number"
                value={formData.maxAttendees}
                onChange={(e) =>
                  setFormData({ ...formData, maxAttendees: e.target.value })
                }
                error={Boolean(errors.maxAttendees)}
                helperText={errors.maxAttendees}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    id="cost"
    name="cost"
    label="Katılım Ücreti (₺)"
    type="number"
    inputProps={{ step: '0.01', min: '0' }}
    value={formData.cost}
    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
    error={Boolean(errors.cost)}
    helperText={errors.cost}
  />
</Grid>


            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Kategori</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formData.category}
                  label="Kategori"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  error={Boolean(errors.category)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
  variant="contained"
  component="label"
  startIcon={<PhotoCamera />}
  sx={{
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)'
        : 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
    '&:hover': {
      background: (theme) =>
        theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)'
          : 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
    },
  }}
                >
                  Etkinlik Görseli Seç
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreview && (
                  <IconButton onClick={clearImage} color="error">
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
              {errors.image && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", mt: 1 }}
                >
                  {errors.image}
                </Typography>
              )}
              {imagePreview && (
                <Box sx={{ mt: 2, position: "relative" }}>
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  height: "48px",
                   background: (theme) =>
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)'
      : undefined, // light modda MUI'nin varsayılan kırmızı tonunu kullansın
  color: theme => theme.palette.getContrastText(theme.palette.error.main),
  '&:hover': {
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)'
        : undefined,
  },
                }}
                disabled={loading}
              >
                {loading ? "Oluşturuluyor..." : "Etkinlik Oluştur"}
              </Button>
            </Grid>
<Box sx={{ width: '100%',              
    display: 'flex',
    justifyContent: 'center',
    mt: 1.5,}}>
  <Button
      size="small"
      variant="contained"
      onClick={() => navigate('/')}
      sx={{
        px: 3,
        background: (theme) =>
  theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)'
    : 'linear-gradient(135deg,#DC2626 0%,#EF4444 100%)',
'&:hover': {
  background: (theme) =>
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)'
      : 'linear-gradient(135deg,#B91C1C 0%, #DC2626 100%)',
},
      }}
    >
      İptal
    </Button>
</Box>

          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default CreateEvent;
