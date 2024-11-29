import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import { logger } from '@/lib/logger';

// Get all sessions for a user
export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const sessions = await Session.find({ 
      userId: session.user.id,
      isValid: true 
    }).sort({ lastActivity: -1 });

    logger.info(`Sessions fetched successfully for user: ${session.user.id}`);
    return NextResponse.json({ sessions });
  } catch (error) {
    logger.error(`Error fetching sessions: ${error.message}`);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Revoke specific session(s)
export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionIds, revokeAll = false } = await req.json();
    await connectDB();

    if (revokeAll) {
      await Session.updateMany(
        { userId: session.user.id },
        { $set: { isValid: false } }
      );

      logger.info(`All sessions revoked for user: ${session.user.id}`);
      return NextResponse.json({ message: 'All sessions revoked successfully' });
    }

    // Revoke specific sessions
    await Session.updateMany(
      { 
        _id: { $in: sessionIds },
        userId: session.user.id // Ensure user can only revoke their own sessions
      },
      { $set: { isValid: false } }
    );

    logger.info(`Sessions revoked for user: ${session.user.id}, sessionIds: ${sessionIds.join(', ')}`);
    return NextResponse.json({ message: 'Sessions revoked successfully' });
  } catch (error) {
    logger.error(`Error revoking sessions: ${error.message}`);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
