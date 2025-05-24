import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Button, Link, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import authService from '../services/authService';

const validationSchema = Yup.object({
  username: Yup.string()
    .matches(/^(?![_.])[a-zA-Z0-9._]{3,20}(?<![_.])$/, 'Kullanıcı adı 3-20 karakter arası olmalı ve sadece harf, rakam, nokta ve alt çizgi içerebilir')
    .required('Kullanıcı adı gereklidir'),
  name: Yup.string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Ad sadece harf içerebilir')
    .required('Ad gereklidir'),
  surname: Yup.string()
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Soyad sadece harf içerebilir')
    .required('Soyad gereklidir'),
  email: Yup.string()
    .email('Geçerli bir email adresi giriniz')
    .required('Email adresi gereklidir'),
  phoneNumber: Yup.string()
    .matches(/^\+[0-9]+$/, 'Telefon numarası + ile başlamalı ve sadece rakam içermelidir')
    .required('Telefon numarası gereklidir'),
  sex: Yup.string()
    .required('Cinsiyet seçimi gereklidir'),
  password: Yup.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre gereklidir'),
});

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      surname: '',
      email: '',
      phoneNumber: '+90',
      sex: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');

      try {
        await authService.register(values);
        navigate('/hobby-selection');
      } catch (err) {
        setError(err.message || 'Kayıt işlemi başarısız oldu');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      minHeight: '100vh'
    }}>
      {/* Sol Panel */}
      <Box sx={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: { xs: 3, sm: 4, md: 6 },
        position: 'relative',
        minHeight: { xs: '400px', md: 'auto' }
      }}>
        <Box sx={{ 
          position: { xs: 'relative', md: 'absolute' }, 
          top: { md: 40 }, 
          left: { md: 40 },
          mb: { xs: 4, md: 0 }
        }}>
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700 }}>
            Vibe Tribe
          </Typography>
        </Box>
        
        <Typography variant="h2" sx={{ 
          color: 'white', 
          fontWeight: 700, 
          mb: 4,
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '3.75rem' }
        }}>
          Aramıza Katıl! 🎉
        </Typography>
        <Typography variant="h6" sx={{ 
          color: 'white', 
          opacity: 0.9, 
          maxWidth: '500px',
          fontSize: { xs: '1rem', sm: '1.25rem' }
        }}>
          Hemen üye ol, ilgi alanlarını seç ve sana özel etkinlikleri keşfet.
          Yeni insanlarla tanış, sosyal çevreni genişlet!
        </Typography>
        
        <Typography variant="caption" sx={{ 
          color: 'white', 
          position: { xs: 'relative', md: 'absolute' },
          bottom: { md: 20 }, 
          left: { md: 40 },
          mt: { xs: 4, md: 0 }
        }}>
          © 2024 Vibe Tribe. Tüm hakları saklıdır.
        </Typography>
      </Box>

      {/* Sağ Panel */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'white',
        p: 4,
        overflowY: 'auto'
      }}>
        <Box sx={{ width: '100%', maxWidth: '400px' }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            Hesap Oluştur
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Birkaç adımda aramıza katıl
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Kullanıcı Adı"
              variant="outlined"
              sx={{ mb: 3 }}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />

            <TextField
              fullWidth
              id="name"
              name="name"
              label="Ad"
              variant="outlined"
              sx={{ mb: 3 }}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth
              id="surname"
              name="surname"
              label="Soyad"
              variant="outlined"
              sx={{ mb: 3 }}
              value={formik.values.surname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.surname && Boolean(formik.errors.surname)}
              helperText={formik.touched.surname && formik.errors.surname}
            />

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              sx={{ mb: 3 }}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              label="Telefon Numarası"
              variant="outlined"
              sx={{ mb: 3 }}
              placeholder="+905XXXXXXXXX"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="sex-label">Cinsiyet</InputLabel>
              <Select
                labelId="sex-label"
                id="sex"
                name="sex"
                value={formik.values.sex}
                label="Cinsiyet"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sex && Boolean(formik.errors.sex)}
              >
                <MenuItem value="male">Erkek</MenuItem>
                <MenuItem value="female">Kadın</MenuItem>
                <MenuItem value="other">Diğer</MenuItem>
              </Select>
              {formik.touched.sex && formik.errors.sex && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {formik.errors.sex}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Şifre"
              type="password"
              variant="outlined"
              sx={{ mb: 3 }}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mb: 2,
                height: '48px',
                background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                }
              }}
            >
              Kayıt Ol
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                mb: 3,
                height: '48px',
                color: 'text.primary',
                borderColor: 'divider'
              }}
            >
              Google ile Kayıt Ol
            </Button>
          </form>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Zaten hesabınız var mı?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 600, color: '#0284C7' }}
              >
                Giriş Yapın
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;