import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import { getLatestSession, invalidateAllSessions } from '@/lib/sessionUtils';
import { Session } from '@/models/Session';
import { connectDB } from '@/lib/mongodb';
import { logger } from '@/lib/logger';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    logger.info('Starting session cleanup process');
    
    // 1. Get current server session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      logger.warn('No active session found');
      return new Response(
        JSON.stringify({ error: 'No active session found' }),
        { status: 401 }
      );
    }

    // 2. Connect to database
    await connectDB();

    // 3. Get latest session for validation
    const latestSession = await getLatestSession(session.user.id);
    if (!latestSession) {
      logger.info('No active session to cleanup');
      return new Response(
        JSON.stringify({ message: 'No active session to cleanup' }),
        { status: 200 }
      );
    }

    // 4. Validate token version
    if (latestSession.tokenVersion !== session.user.tokenVersion) {
      logger.info('Session already invalidated');
      return new Response(
        JSON.stringify({ message: 'Session already invalidated' }),
        { status: 200 }
      );
    }

    // 5. Invalidate all sessions
    await invalidateAllSessions(session.user.id);

    // 6. Update session status using mongoose model
    const SessionModel = mongoose.models.Session || mongoose.model('Session', Session);
    await SessionModel.updateMany(
      { userId: session.user.id },
      { 
        $set: { 
          status: 'ended',
          endedAt: new Date(),
          endReason: 'user_logout'
        }
      }
    );

    logger.info(`Successfully cleaned up sessions for user: ${session.user.email}`);
    return new Response(
      JSON.stringify({ message: 'Sessions cleaned up successfully' }),
      { status: 200 }
    );

  } catch (error) {
    logger.error('Session cleanup error:', { error: error.message, stack: error.stack });
    
    // Return appropriate error message based on error type
    const errorMessage = error.code === 11000 
      ? 'Session already being processed'
      : 'Failed to cleanup session';

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { status: 500 }
    );
  }
}
