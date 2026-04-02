import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getJsonData, getBlacklistedData } from '@/lib/jsondb';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const token = searchParams.get('token');

    if (!id || !token) {
      return NextResponse.json(
        { valid: false, message: 'Missing ID or Token' },
        { status: 400 }
      );
    }

    // Get data from JSON database
    const db = await getJsonData();

    // Find user by ID and token
    let user = db.find((u) => u.id === id && u.token === token);

    // If not found in active DB, check blacklist
    if (!user) {
      const blacklist = await getBlacklistedData();
      user = blacklist.find((u) => u.id === id && u.token === token);

      if (!user) {
        return NextResponse.json(
          { valid: false, message: 'QR/Token combination not found' },
          { status: 404 }
        );
      }
    }

    // Remove token before sending (security)
    const { token: _removedToken, ...safeUser } = user;

    return NextResponse.json(
      {
        valid: user.status !== 'inactive',
        user: safeUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      {
        valid: false,
        message: 'Server error',
      },
      { status: 500 }
    );
  }
}
