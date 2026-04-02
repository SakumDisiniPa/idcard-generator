export const CONSTRAINTS = {
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  CUSTOM_ID: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 20,
  },
  NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  FILE: {
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

export const MESSAGES = {
  SUCCESS: {
    UPLOAD: '✅ Data berhasil diunggah!',
    QR_GENERATED: '✅ QR Code berhasil dibuat!',
  },
  ERROR: {
    UPLOAD_FAILED: '❌ Gagal mengunggah data. Periksa koneksi server.',
    MISSING_FIELDS: '❌ Semua field wajib diisi.',
    INVALID_FILE: '❌ Format file tidak didukung atau ukuran terlalu besar.',
    AUTH_FAILED: '❌ ID Akses salah. Silakan coba lagi.',
  },
};

export const API_ENDPOINTS = {
  UPLOAD: '/api/upload',
  VERIFY: '/api/verify',
};
