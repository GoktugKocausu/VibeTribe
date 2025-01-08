import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import authService from '../services/authService';

// Hobi kategorileri ve alt hobiler
const hobbyCategories = {
  'Spor & Fitness': [
    'Yoga', 'Koşu', 'Yüzme', 'Bisiklet', 'Futbol', 'Basketbol', 'Tenis',
    'Pilates', 'Dans', 'Hiking'
  ],
  'Sanat & Yaratıcılık': [
    'Resim', 'Müzik', 'Fotoğrafçılık', 'El Sanatları', 'Seramik', 'Dijital Sanat',
    'Tiyatro', 'Yazarlık', 'Şiir', 'Film Yapımı'
  ],
  'Eğitim & Gelişim': [
    'Yabancı Dil', 'Kodlama', 'Kişisel Gelişim', 'Meditasyon', 'Kitap Kulübü',
    'Girişimcilik', 'Finans', 'Tarih', 'Bilim', 'Felsefe'
  ],
  'Sosyal & Eğlence': [
    'Board Oyunları', 'Video Oyunları', 'Karaoke', 'Yemek Yapımı', 'Şarap Tadımı',
    'Seyahat', 'Konserler', 'Parti', 'Gönüllülük', 'Sosyal Sorumluluk'
  ]
};

const HobbySelection = () => {
  const navigate = useNavigate();
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHobbyToggle = (hobby) => {
    setSelectedHobbies(prev => {
      if (prev.includes(hobby)) {
        return prev.filter(h => h !== hobby);
      } else {
        return [...prev, hobby];
      }
    });
    setError('');
  };

  const handleSubmit = async () => {
    if (selectedHobbies.length < 3) {
      setError('Lütfen en az 3 hobi seçiniz');
      return;
    }

    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Kullanıcı bulunamadı');
      }

      await userService.updateUserHobbies(currentUser.username, selectedHobbies);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Hobiler kaydedilirken bir hata oluştu');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#F9FAFB',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            İlgi Alanlarını Seç
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Sana özel etkinlikleri önerebilmemiz için en az 3 ilgi alanı seç
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ 
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }
        }}>
          {Object.entries(hobbyCategories).map(([category, hobbies]) => (
            <Card key={category} sx={{ 
              height: '100%',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  {category}
                </Typography>
                <Box sx={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1
                }}>
                  {hobbies.map((hobby) => (
                    <Chip
                      key={hobby}
                      label={hobby}
                      onClick={() => handleHobbyToggle(hobby)}
                      sx={{
                        borderRadius: '16px',
                        px: 1,
                        ...(selectedHobbies.includes(hobby) ? {
                          bgcolor: '#0284C7',
                          color: '#FFFFFF',
                          border: '1px solid #0284C7',
                          '&:hover': {
                            bgcolor: '#0369A1'
                          }
                        } : {
                          bgcolor: 'white',
                          color: '#0284C7',
                          border: '1px solid #0284C7',

                          '&:hover': {
                            bgcolor: 'white',
                            borderColor: '#0369A1',
                            color: '#0369A1'
                          }
                        })
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          mt: 6
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Devam Et (${selectedHobbies.length} seçildi)`
            )}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HobbySelection;