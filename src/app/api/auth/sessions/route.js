import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import { logger } from '@/lib/logger';

// Get all active sessions for the current user
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const activeSessions = await Session.find({
      userId: session.user.id,
      isActive: true
    }).sort({ lastAccessed: -1 });

    // Mark current session
    const currentSession = activeSessions.map(session => ({
      ...session.toObject(),
      isCurrentSession: session._id.toString() === session.sessionId
    }));

    logger.info(`Retrieved active sessions for user: ${session.user.email}`);
    return NextResponse.json({ sessions: currentSession });

  } catch (error) {
    logger.error(`Error fetching sessions: ${error.message}`);
    return NextResponse.json(
      { error: 'Failed to fetch active sessions' },
      { status: 500 }
    );
  }
}

// Logout from specific device/session
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // Deactivate specific session
      const targetSession = await Session.findOne({
        _id: sessionId,
        userId: session.user.id
      });

      if (!targetSession) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      await Session.findByIdAndUpdate(sessionId, { 
        isActive: false,
        deactivatedAt: new Date(),
        deactivatedBy: session.user.id
      });
      
      logger.info(`Deactivated session ${sessionId} for user: ${session.user.email}`);
    } else {
      // Deactivate all sessions for the user
      await Session.updateMany(
        { userId: session.user.id },
        { 
          isActive: false,
          deactivatedAt: new Date(),
          deactivatedBy: session.user.id
        }
      );

      logger.info(`Deactivated all sessions for user: ${session.user.email}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    logger.error(`Error managing sessions: ${error.message}`);
    return NextResponse.json(
      { error: 'Failed to manage sessions' },
      { status: 500 }
    );
  }
}
