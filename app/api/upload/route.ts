import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import path from 'path';
import { addJsonEntry } from '@/lib/jsondb';
import { saveImage, saveBase64QRCode } from '@/lib/imageStorage';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface UploadRequest {
  file: File;
  id: string;
  nama: string;
  ttl: string;
  phone: string;
  contractEndDate: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const nama = formData.get('nama') as string;
    const customId = formData.get('id') as string;
    const ttl = formData.get('ttl') as string;
    const phone = formData.get('phone') as string;
    const contractEndDate = formData.get('contractEndDate') as string;
    const isProfileUpdate = formData.get('isProfileUpdate') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // For profile update, we don't need these fields
    if (!isProfileUpdate && (!nama || !ttl || !phone || !contractEndDate)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const uniqueId = customId || Date.now().toString(36);
    const fileExtension = path.extname(file.name);
    const fileName = `${uniqueId}${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save image to local storage
    const uploadedImageUrl = await saveImage(buffer, fileName);

    // If this is a profile update, just return the image URL
    if (isProfileUpdate) {
      return NextResponse.json(
        {
          success: true,
          image: uploadedImageUrl,
        },
        { status: 200 }
      );
    }

    // Generate QR code for new employee
    const statusUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/status/${uniqueId}?token=${uuidv4()}`;

    let qrDataUrl = '';
    await new Promise<void>((resolve, reject) => {
      QRCode.toDataURL(
        statusUrl,
        {
          color: { dark: '#000000', light: '#ffffff' },
          width: 800,
          margin: 2,
        },
        (err: Error | null, url?: string) => {
          if (err) reject(err);
          if (url) {
            qrDataUrl = url;
          }
          resolve();
        }
      );
    });

    // Save QR code to local storage
    const qrFileName = `${uniqueId}-qr.png`;
    const uploadedQrUrl = await saveBase64QRCode(qrDataUrl, qrFileName);

    // Determine status based on contract end date
    const today = new Date().toISOString().split('T')[0];
    const status = contractEndDate >= today ? 'active' : 'expired';

    const token = uuidv4();
    // Save to JSON database
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
      contractEndDate,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        id: uniqueId,
        token,
        qrUrl: uploadedQrUrl,
        uploadedImage: uploadedImageUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process upload',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
