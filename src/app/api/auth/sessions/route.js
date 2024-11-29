import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import { logger } from '@/lib/logger';
import { headers } from 'next/headers';

// Get all sessions for a user
export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Ensure current session exists
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
              headersList.get('x-real-ip') || 
              'unknown';

    // Parse user agent
    const browser = userAgent.match(/(chrome|safari|firefox|edge|opera|ie)\/?\s*(\d+)/i)?.[1] || 'unknown';
    const os = userAgent.match(/windows|mac|linux|android|ios/i)?.[0] || 'unknown';
    const device = userAgent.match(/mobile|tablet/i) ? 'mobile' : 'desktop';

    // Ensure current session is in database
    await Session.findOneAndUpdate(
      { 
        sessionToken: session.sessionId,
        userId: session.user.id
      },
      { 
        $set: { 
          lastActivity: new Date(),
          isValid: true,
          deviceInfo: {
            userAgent,
            browser,
            os,
            device,
            ip
          }
        }
      },
      { 
        upsert: true,
        new: true
      }
    );

    // Get all valid sessions including current one
    const sessions = await Session.find({ 
      userId: session.user.id,
      isValid: true 
    }).sort({ lastActivity: -1 });

    // Process sessions to mark current one
    const processedSessions = sessions.map(s => ({
      ...s.toObject(),
      isCurrentSession: s.sessionToken === session.sessionId
    }));

    logger.info(`Sessions fetched successfully for user: ${session.user.id}, count: ${sessions.length}`);
    return NextResponse.json({ sessions: processedSessions });
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
      // Don't revoke current session
      await Session.updateMany(
        { 
          userId: session.user.id,
          sessionToken: { $ne: session.sessionId }
        },
        { $set: { isValid: false } }
      );

      logger.info(`All other sessions revoked for user: ${session.user.id}`);
      return NextResponse.json({ message: 'All other sessions revoked successfully' });
    }

    // Don't allow revoking current session
    if (sessionIds.includes(session.sessionId)) {
      return NextResponse.json({ error: 'Cannot revoke current session' }, { status: 400 });
    }

    // Revoke specific sessions
    await Session.updateMany(
      { 
        _id: { $in: sessionIds },
        userId: session.user.id
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
