import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

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

  // simpan file ke disk
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filePath, buffer);

  // buat QR transparan dan HD
  // Menggunakan uniqueId untuk URL QR
  const statusUrl = `http://localhost:3000/status/${uniqueId}?token=${token}`;
  const qrPath = path.join(qrDir, `${uniqueId}.png`);

  await QRCode.toFile(qrPath, statusUrl, {
    color: {
      dark: "#000000",
      light: "#0000", // transparan
    },
    width: 800, // HD
  });

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
    image: `/uploads/${fileName}`,
    createdAt: new Date().toISOString(),
  });

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  return Response.json({
    success: true,
    id: uniqueId,
    token,
    qrUrl: `/qrcodes/${uniqueId}.png`,
    uploadedImage: `/uploads/${fileName}`,
  });
}