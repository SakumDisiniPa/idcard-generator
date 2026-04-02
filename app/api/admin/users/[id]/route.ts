import { NextRequest, NextResponse } from 'next/server';
import { findById, updateJsonEntry, deleteJsonEntry } from '@/lib/jsondb';
import { deleteImage, deleteQRCode, getFilenameFromUrl } from '@/lib/imageStorage';

const SECRET_ACCESS_ID = process.env.SECRET_ACCESS_ID;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Check authentication
    const accessId = req.headers.get('x-access-id');
    if (accessId !== SECRET_ACCESS_ID) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const entry = await findById(id);

    if (!entry) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(entry, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Check authentication
    const accessId = req.headers.get('x-access-id');
    if (accessId !== SECRET_ACCESS_ID) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const updates = await req.json();

    // Only allow updating certain fields
    const allowedFields = ['nama', 'ttl', 'phone', 'contractEndDate', 'status'];
    const safeUpdates: Record<string, unknown> = {};

    allowedFields.forEach((field) => {
      if (field in updates) {
        safeUpdates[field] = updates[field];
      }
    });

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    await updateJsonEntry(id, safeUpdates);

    const updatedEntry = await findById(id);

    return NextResponse.json(
      { success: true, data: updatedEntry },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Check authentication
    const accessId = req.headers.get('x-access-id');
    if (accessId !== SECRET_ACCESS_ID) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const entry = await findById(id);

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

    // Delete from database
    await deleteJsonEntry(id);

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
