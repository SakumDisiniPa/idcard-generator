import fs from 'fs/promises';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public/uploads');
const imagesDir = path.join(uploadsDir, 'images');
const qrcodesDir = path.join(uploadsDir, 'qrcodes');

async function ensureDirectories() {
  await fs.mkdir(imagesDir, { recursive: true });
  await fs.mkdir(qrcodesDir, { recursive: true });
}

export async function saveImage(buffer: Buffer, filename: string): Promise<string> {
  await ensureDirectories();

  const filepath = path.join(imagesDir, filename);
  await fs.writeFile(filepath, buffer);

  // Return relative URL path for public access
  return `/uploads/images/${filename}`;
}

export async function saveQRCode(buffer: Buffer, filename: string): Promise<string> {
  await ensureDirectories();

  const filepath = path.join(qrcodesDir, filename);
  await fs.writeFile(filepath, buffer);

  // Return relative URL path for public access
  return `/uploads/qrcodes/${filename}`;
}

export async function saveBase64QRCode(base64Data: string, filename: string): Promise<string> {
  await ensureDirectories();

  // Remove data:image/png;base64, prefix if present
  const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64String, 'base64');

  const filepath = path.join(qrcodesDir, filename);
  await fs.writeFile(filepath, buffer);

  // Return relative URL path for public access
  return `/uploads/qrcodes/${filename}`;
}

export async function deleteImage(filename: string): Promise<void> {
  try {
    const filepath = path.join(imagesDir, filename);
    await fs.unlink(filepath);
  } catch (error) {
    console.error(`Failed to delete image ${filename}:`, error);
  }
}

export async function deleteQRCode(filename: string): Promise<void> {
  try {
    const filepath = path.join(qrcodesDir, filename);
    await fs.unlink(filepath);
  } catch (error) {
    console.error(`Failed to delete QR code ${filename}:`, error);
  }
}

export function getFilenameFromUrl(url: string): string {
  return path.basename(url);
}
