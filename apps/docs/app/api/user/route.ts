import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/server/users';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getSession();

    // If no session or user, return unauthorized
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return the user data
    return NextResponse.json(session.user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
