import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import authService from '../services/authService';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
    .required('Kullanıcı adı gereklidir'),
  password: Yup.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre gereklidir'),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        const response = await authService.login(values.username, values.password);
        if (response.token) {
          navigate('/');
        } else {
          setError('Giriş başarısız oldu');
        }
      } catch (err) {
        setError(err.message || 'Giriş yapılırken bir hata oluştu');
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
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`,
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
          Hoş Geldiniz! 👋
        </Typography>
        <Typography variant="h6" sx={{ 
          color: 'white', 
          opacity: 0.9, 
          maxWidth: '500px',
          fontSize: { xs: '1rem', sm: '1.25rem' }
        }}>
          Etkinliklere katılmak için giriş yapın ve sosyal çevrenizi genişletin!
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
        p: 4
      }}>
        <Box sx={{ width: '100%', maxWidth: '400px' }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            Giriş Yap
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Hesabınıza giriş yaparak devam edin
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
              Giriş Yap
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
              Google ile Giriş Yap
            </Button>
          </form>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Hesabınız yok mu?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{ fontWeight: 600, color: '#0284C7' }}
              >
                Kayıt Olun
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;