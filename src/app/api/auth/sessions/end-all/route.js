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

    // Get the current session ID from request body
    const { currentSessionId } = await req.json();
    if (!currentSessionId) {
      return NextResponse.json({ error: 'Current session ID is required' }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Verify the current session exists and belongs to the user
    const currentSession = await Session.findById(currentSessionId);
    if (!currentSession || currentSession.userId !== session.user.id) {
      logger.warn(`Invalid session verification. User: ${session.user.id}, Session: ${currentSessionId}`);
      return NextResponse.json({ error: 'Invalid session' }, { status: 403 });
    }

    // Delete all other sessions for this user
    const result = await Session.deleteMany({
      userId: session.user.id,
      _id: { $ne: currentSessionId }
    });

    logger.info(`Multiple sessions ended. User: ${session.user.id}, Sessions removed: ${result.deletedCount}`);

    return NextResponse.json({ 
      success: true,
      message: 'All other sessions ended successfully',
      sessionsEnded: result.deletedCount
    });

  } catch (error) {
    logger.error(`Error ending all sessions: ${error.message}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
