import { NextRequest, NextResponse } from 'next/server';
import { findById, moveToBlacklist } from '@/lib/jsondb';

const SECRET_ACCESS_ID = process.env.SECRET_ACCESS_ID;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const accessId = req.headers.get('x-access-id');
    if (accessId !== SECRET_ACCESS_ID) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, reason } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }

    if (!reason || (reason !== 'dipecat' && reason !== 'mengundurkan diri')) {
      return NextResponse.json(
        { error: 'Invalid reason' },
        { status: 400 }
      );
    }

    const user = await findById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Move to blacklist instead of deleting
    await moveToBlacklist(id, reason);

    return NextResponse.json(
      { success: true, message: 'User deactivated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deactivating user:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate user' },
      { status: 500 }
    );
  }
}
