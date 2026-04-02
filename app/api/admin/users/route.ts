import { NextRequest, NextResponse } from 'next/server';
import { getJsonData, getBlacklistedData, deleteJsonEntry } from '@/lib/jsondb';
import { deleteImage, deleteQRCode, getFilenameFromUrl } from '@/lib/imageStorage';
import fs from 'fs';
import path from 'path';

const SECRET_ACCESS_ID = process.env.SECRET_ACCESS_ID;
const blacklistPath = path.join(process.cwd(), 'data', 'blacklist.json');

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const accessId = req.headers.get('x-access-id');
    if (accessId !== SECRET_ACCESS_ID) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch both active and inactive employees
    const activeData = await getJsonData();
    const blacklistedData = await getBlacklistedData();

    // Combine both lists
    const allData = [...activeData, ...blacklistedData];

    return NextResponse.json(allData, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const accessId = req.headers.get('x-access-id');
    if (accessId !== SECRET_ACCESS_ID) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get ID from either query params or body
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    
    if (!id) {
      const body = await req.json();
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }

    // Check both active and blacklist
    const activeData = await getJsonData();
    const blacklistedData = await getBlacklistedData();
    
    let entry = activeData.find((e) => e.id === id);
    let isFromBlacklist = false;
    
    if (!entry) {
      entry = blacklistedData.find((e) => e.id === id);
      isFromBlacklist = true;
    }

    if (!entry) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete image and QR code files
    if (entry.image) {
      const imageFilename = getFilenameFromUrl(entry.image);
      await deleteImage(imageFilename);
    }

    if (entry.qr) {
      const qrFilename = getFilenameFromUrl(entry.qr);
      await deleteQRCode(qrFilename);
    }

    // Delete from appropriate database
    if (isFromBlacklist) {
      // Remove from blacklist
      const filtered = blacklistedData.filter((e) => e.id !== id);
      await fs.promises.writeFile(blacklistPath, JSON.stringify(filtered, null, 2));
    } else {
      // Remove from active database
      await deleteJsonEntry(id);
    }

    return NextResponse.json(
      { success: true, message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
