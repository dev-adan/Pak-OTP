'use server';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import { logger } from '@/lib/logger';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ 
        success: false,
        message: 'Unauthorized' 
      }, { status: 401 });
    }
    
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ 
        success: false,
        message: 'Session ID is required'
      }, { status: 400 });
    }

    await connectDB();

    // Find the specific session
    const targetSession = await Session.findOne({
      _id: sessionId,
      userId: session.user.id
    });

    if (!targetSession) {
      return NextResponse.json({ 
        success: false,
        message: 'Session not found or unauthorized'
      }, { status: 404 });
    }

    // Delete the session
    await Session.findByIdAndDelete(sessionId);

    // Verify deletion
    const verifySession = await Session.findById(sessionId);
    if (verifySession) {
      return NextResponse.json({ 
        success: false,
        message: 'Failed to end session'
      }, { status: 500 });
    }

    // Check if this was the last active session
    const remainingActiveSessions = await Session.countDocuments({
      userId: session.user.id,
      isActive: true
    });

    return NextResponse.json({ 
      success: true,
      message: 'Session ended successfully',
      isLastSession: remainingActiveSessions === 0
    });

  } catch (error) {
    logger.error(`Session end error: ${error.message}`);
    return NextResponse.json({ 
      success: false,
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
