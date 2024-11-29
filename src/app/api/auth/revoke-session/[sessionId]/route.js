import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import { logger } from '@/lib/logger';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { sessionId } = params;

    const targetSession = await Session.findById(sessionId);
    if (!targetSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check if user is admin or the owner of the session
    if (session.user.role !== 'admin' && targetSession.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Session.findByIdAndUpdate(sessionId, { isValid: false });
    logger.info(`Session ${sessionId} revoked by user: ${session.user.id}`);

    return NextResponse.json({ message: 'Session revoked successfully' });
  } catch (error) {
    logger.error(`Error revoking session: ${error.message}`);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
