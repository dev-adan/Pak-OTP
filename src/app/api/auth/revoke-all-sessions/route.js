import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import { logger } from '@/lib/logger';

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    await Session.updateMany(
      { userId: session.user.id },
      { $set: { isValid: false } }
    );

    logger.info(`All sessions revoked for user: ${session.user.id}`);
    return NextResponse.json({ message: 'All sessions revoked successfully' });
  } catch (error) {
    logger.error(`Error revoking all sessions: ${error.message}`);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
