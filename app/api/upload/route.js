import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic"; // biar ga cache upload

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  // Mendapatkan data 'nama' dari formData
  const nama = formData.get("nama"); // <-- Tambahan data nama
  const customId = formData.get("id");
  const ttl = formData.get("ttl");
  const phone = formData.get("phone");

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  // pastikan folder ada
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const qrDir = path.join(process.cwd(), "public", "qrcodes");
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.mkdirSync(qrDir, { recursive: true });

  // buat nama file unik
  // Menggunakan customId jika ada, atau id acak jika customId kosong
  const uniqueId = customId || Date.now().toString(36); 
  const token = uuidv4();
  const fileExtension = path.extname(file.name);
  const fileName = `${uniqueId}${fileExtension}`; // menggunakan uniqueId untuk nama file
  const filePath = path.join(uploadDir, fileName);

  // baca file ke buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload ke Vercel Blob
  let uploadedImageUrl = `/uploads/${fileName}`; // fallback to local path if blob not available

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(fileName, buffer, {
        access: "public",
        contentType: file.type || "application/octet-stream",
      });
      uploadedImageUrl = blob.url;
    } catch (err) {
      // If blob upload fails, write to local uploads as fallback and continue
      console.error("Vercel Blob upload failed, saving locally:", err.message);
      fs.writeFileSync(filePath, buffer);
    }
  } else {
    // no token configured - save locally
    fs.writeFileSync(filePath, buffer);
  }

  // buat QR transparan dan HD
  // Menggunakan uniqueId untuk URL QR
  const statusUrl = `https://idcard-ptdahlia.sakum.my.id/status/${uniqueId}?token=${token}`;
  const qrPath = path.join(qrDir, `${uniqueId}.png`);

  await QRCode.toFile(qrPath, statusUrl, {
    color: {
      dark: "#000000",
      light: "#0000", // transparan
    },
    width: 800, // HD
  });

  // Upload QR to Vercel Blob (or keep local qrcode as fallback)
  const qrFileName = `${uniqueId}-qr.png`;
  let uploadedQrUrl = `/qrcodes/${uniqueId}.png`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const qrBuffer = fs.readFileSync(qrPath);

      const qrBlob = await put(qrFileName, qrBuffer, {
        access: "public",
        contentType: "image/png",
      });
      uploadedQrUrl = qrBlob.url;
    } catch (err) {
      console.error("Vercel Blob upload for QR failed, keeping local file:", err.message);
      // keep local qrPath as fallback (already written by QRCode.toFile)
    }
  }

  // ✅ simpan data ke "database"
  const dbPath = path.join(process.cwd(), "data.json");
  let db = [];
  if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  }

  // tambahkan data baru
  db.push({
    id: uniqueId, // Menggunakan ID yang sama untuk semua referensi
    token,
    customId: customId,
    nama: nama, // <-- Simpan data nama
    ttl: ttl,
    phone: phone,
    image: uploadedImageUrl,
    qr: uploadedQrUrl,
    createdAt: new Date().toISOString(),
  });

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  return Response.json({
    success: true,
    id: uniqueId,
    token,
    qrUrl: uploadedQrUrl,
    uploadedImage: uploadedImageUrl,
  });
}