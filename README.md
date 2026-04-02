# ID Card Generator - PT DAHLIA

Sistem generator dan verifikasi ID Card dengan QR Code terintegrasi.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan credential Anda

# Development
npm run dev

# Production build
npm run build
npm start
```

## 📋 Environment Variables

```
BLOB_READ_WRITE_TOKEN    - Vercel Blob storage token
SECRET_ACCESS_ID         - Server-side access ID
NEXT_PUBLIC_SECRET_ACCESS_ID - Client-side access ID (sama dengan SECRET_ACCESS_ID)
```

## ✨ Features

- 🔐 Access control dengan ID verifikasi
- 📸 Upload foto dengan validasi
- 🔲 Generate QR Code otomatis
- ✅ Verify QR Code dengan token
- 📱 Fully responsive design
- 🌙 Dark mode support
- 📦 Data stored in JSON format
- 🔒 Type-safe TypeScript implementation

## 📱 Pages

- `/` - Main upload form (requires authentication)
- `/status/[id]` - QR verification & data display

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Vercel Blob Storage

## 📁 Project Structure

```
app/
  components/     - Reusable components (AuthForm, UploadForm, QRDisplay)
  hooks/          - Custom hooks (useAuth)
  utils/          - Utilities & validators
  api/            - API routes (upload, verify)
lib/
  jsondb.ts       - JSON database utilities
```

## 🔄 Data Flow

1. User login dengan access ID
2. Upload foto + data personal
3. Server generate token & QR Code
4. Data disimpan ke JSON database
5. User dapat download QR Code
6. Scan QR untuk verifikasi data

