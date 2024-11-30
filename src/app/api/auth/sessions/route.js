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
    
    // Handle no session case gracefully
    if (!session || !session.user) {
      logger.info('No active session found during sessions fetch');
      return NextResponse.json({ 
        sessions: [],
        message: 'No active session'
      });
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

    logger.info(`Retrieved ${activeSessions.length} active sessions for user: ${session.user.email}`);
    return NextResponse.json({ 
      sessions: currentSession,
      message: 'Sessions retrieved successfully'
    });

  } catch (error) {
    logger.error(`Error fetching sessions: ${error.message}`);
    // Return empty sessions array instead of error
    return NextResponse.json({ 
      sessions: [],
      message: 'Error fetching sessions'
    });
  }
}

// Logout from specific device/session
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // Handle no session case gracefully
    if (!session || !session.user) {
      logger.info('No active session found during session deletion');
      return NextResponse.json({ 
        success: true,
        message: 'No active session to delete'
      });
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
        logger.info(`Session ${sessionId} not found or already deleted`);
        return NextResponse.json({ 
          success: true,
          message: 'Session not found or already deleted'
        });
      }

      await Session.findByIdAndUpdate(sessionId, { 
        isActive: false,
        deactivatedAt: new Date(),
        deactivatedBy: session.user.id
      });
      
      logger.info(`Successfully deactivated session ${sessionId} for user: ${session.user.email}`);
    } else {
      logger.info(`No session ID provided, no action taken for user: ${session.user.email}`);
    }

    return NextResponse.json({ 
      success: true,
      message: sessionId ? 'Session deactivated successfully' : 'No session ID provided'
    });

  } catch (error) {
    logger.error(`Error managing sessions: ${error.message}`);
    return NextResponse.json({ 
      success: false,
      message: 'Error managing sessions, but continuing logout process'
    });
  }
}
