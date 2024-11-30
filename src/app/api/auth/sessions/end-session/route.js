import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import Session from '@/models/Session';
import { connectDB } from '@/lib/mongodb';
import { logger } from '@/lib/logger';

export async function POST(req) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the session ID to end from request body
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Find the session to end
    const sessionToEnd = await Session.findById(sessionId);
    if (!sessionToEnd) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Only allow ending sessions that belong to the current user
    if (sessionToEnd.userId !== session.user.id) {
      logger.warn(`Unauthorized attempt to end session. User: ${session.user.id}, Session: ${sessionId}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the session
    await Session.deleteOne({ _id: sessionId });

    logger.info(`Session deleted successfully. SessionId: ${sessionId}, User: ${session.user.id}`);

    return NextResponse.json({ 
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    logger.error(`Error ending session: ${error.message}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
