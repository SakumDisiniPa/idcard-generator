import path from "path";
import fs from "fs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  if (!id || !token) {
    return Response.json({ valid: false, message: "Missing ID or Token" });
  }

  // Lokasi "database" (file JSON)
  const dbPath = path.join(process.cwd(), "data", "db.json");

  if (!fs.existsSync(dbPath)) {
    // 1. Jika database belum ada, anggap tidak valid
    return Response.json({ valid: false, message: "Data not found" });
  }

  let db = [];
  try {
    // 2. Tambahkan try...catch untuk menangani file kosong/rusak
    const fileContent = fs.readFileSync(dbPath, "utf-8");
    if (fileContent.trim().length > 0) {
        db = JSON.parse(fileContent);
    }
  } catch (error) {
    // Jika ada error saat parsing JSON (misalnya file kosong atau SyntaxError)
    console.error("Error reading or parsing data.json in /api/verify:", error.message);
    return Response.json({ valid: false, message: "Server data error" });
  }
  
  // Cari data user berdasarkan id + token
  // Catatan: Menggunakan 'id' untuk ID unik dan 'token' untuk token verifikasi
  const user = db.find((u) => u.id === id && u.token === token);

  if (!user) {
    return Response.json({ valid: false, message: "QR/Token combination not found" });
  }

  // Hapus token sebelum dikirim ke client (KEAMANAN)
  // Walaupun data ini publik, lebih baik tidak mengekspos token
  const { token: removedToken, ...safeUser } = user; 

  return Response.json({ 
    valid: true, 
    user: safeUser // Mengembalikan data user yang lebih aman
  });
}