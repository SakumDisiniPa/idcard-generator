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

  // buat nama file unik
  // Menggunakan customId jika ada, atau id acak jika customId kosong
  const uniqueId = customId || Date.now().toString(36); 
  const token = uuidv4();
  const fileExtension = path.extname(file.name);
  const fileName = `${uniqueId}${fileExtension}`; // menggunakan uniqueId untuk nama file

  // baca file ke buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload ke Vercel Blob
  let uploadedImageUrl = ``;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(fileName, buffer, {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });
    uploadedImageUrl = blob.url;
  }

  // buat QR transparan dan HD
  // Menggunakan uniqueId untuk URL QR
  const statusUrl = `https://idcard-ptdahlia.sakum.my.id/status/${uniqueId}?token=${token}`;

  // Generate QR sebagai buffer tanpa write ke disk
  let qrBuffer;
  await new Promise((resolve, reject) => {
    QRCode.toDataURL(statusUrl, {
      color: {
        dark: "#000000",
        light: "#0000", // transparan
      },
      width: 800, // HD
    }, (err, url) => {
      if (err) reject(err);
      // Convert data URL to buffer
      const base64Data = url.replace(/^data:image\/png;base64,/, "");
      qrBuffer = Buffer.from(base64Data, "base64");
      resolve();
    });
  });

  // Upload QR to Vercel Blob
  const qrFileName = `${uniqueId}-qr.png`;
  let uploadedQrUrl = ``;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const qrBlob = await put(qrFileName, qrBuffer, {
      access: "public",
      contentType: "image/png",
    });
    uploadedQrUrl = qrBlob.url;
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