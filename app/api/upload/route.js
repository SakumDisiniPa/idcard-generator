import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import path from "path";
import { put } from "@vercel/blob";
import { addJsonEntry } from "@/lib/jsondb";  // ⬅ ganti mysql ke json

export const dynamic = "force-dynamic";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const nama = formData.get("nama");
  const customId = formData.get("id");
  const ttl = formData.get("ttl");
  const phone = formData.get("phone");

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const uniqueId = customId || Date.now().toString(36);
  const token = uuidv4();
  const fileExtension = path.extname(file.name);
  const fileName = `${uniqueId}${fileExtension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let uploadedImageUrl = "";

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(fileName, buffer, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: true,
    });
    uploadedImageUrl = blob.url;
  }

  const statusUrl = `https://idcard-ptdahlia.sakum.my.id/status/${uniqueId}?token=${token}`;

  let qrBuffer;
  await new Promise((resolve, reject) => {
    QRCode.toDataURL(
      statusUrl,
      {
        color: { dark: "#000000", light: "#0000" },
        width: 800,
      },
      (err, url) => {
        if (err) reject(err);
        const base64Data = url.replace(/^data:image\/png;base64,/, "");
        qrBuffer = Buffer.from(base64Data, "base64");
        resolve();
      }
    );
  });

  const qrFileName = `${uniqueId}-qr.png`;
  let uploadedQrUrl = "";

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const qrBlob = await put(qrFileName, qrBuffer, {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: true,
    });
    uploadedQrUrl = qrBlob.url;
  }

  // ⬇⬇⬇ SIMPAN KE JSON FILE
  try {
    await addJsonEntry({
      id: uniqueId,
      token,
      customId,
      nama,
      ttl,
      phone,
      image: uploadedImageUrl,
      qr: uploadedQrUrl,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Failed to save JSON:", err.message);
    return Response.json(
      { error: "Failed to save data to JSON", message: err.message },
      { status: 500 }
    );
  }

  return Response.json({
    success: true,
    id: uniqueId,
    token,
    qrUrl: uploadedQrUrl,
    uploadedImage: uploadedImageUrl,
  });
}
