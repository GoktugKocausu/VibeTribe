
// Projenin her yerinde tek kaynaktan erişebilmek için ilgi alanlarını burada saklıyoruz.

export const hobbyCategories = {
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

// Düz liste halinde ihtiyaç duyan componentler için
export const hobbyOptions = Object.values(hobbyCategories).flat();
