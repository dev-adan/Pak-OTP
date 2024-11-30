import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import { logger } from '@/lib/logger';

export async function POST(req) {
  try {
    logger.info('Starting session cleanup process');
    
    const session = await getServerSession(authOptions);
    if (!session) {
      logger.warn('Unauthorized session cleanup attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get the current session ID from the session object
    const sessionId = session.sessionId;
    logger.info(`Attempting to cleanup session: ${sessionId} for user: ${session.user.email}`);
    
    if (!sessionId) {
      logger.error('No session ID found in current session');
      return NextResponse.json({ error: 'No session ID found' }, { status: 400 });
    }

    // Find and delete the specific session
    const result = await Session.findOneAndDelete({
      _id: sessionId,
      userId: session.user.id // Ensure the session belongs to the current user
    });

    if (!result) {
      logger.warn(`Session not found or unauthorized: ${sessionId}`);
      return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
    }

    logger.info(`Successfully cleaned up session ${sessionId} for user: ${session.user.email}`);
    return NextResponse.json({ 
      success: true,
      message: 'Session deleted successfully',
      sessionId: sessionId
    });

  } catch (error) {
    logger.error(`Error cleaning up session: ${error.message}`);
    return NextResponse.json(
      { error: 'Failed to clean up session' },
      { status: 500 }
    );
  }
}
