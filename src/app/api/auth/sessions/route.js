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
    console.log('🔍 Starting session deletion process...');
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.log('❌ No active session found');
      return NextResponse.json({ 
        success: false,
        message: 'Unauthorized: No active session'
      }, { status: 401 });
    }

    console.log('👤 User authenticated:', session.user.email);
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    console.log('🎯 Target sessionId:', sessionId);

    if (!sessionId) {
      console.log('❌ No sessionId provided in request');
      return NextResponse.json({ 
        success: false,
        message: 'Session ID is required'
      }, { status: 400 });
    }

    await connectDB();
    console.log('🔌 Connected to MongoDB');

    // First, let's see what's in the database
    const allSessions = await Session.find({ userId: session.user.id });
    console.log('📊 All sessions for user:', allSessions.map(s => ({
      id: s._id.toString(),
      isActive: s.isActive,
      lastAccessed: s.lastAccessed
    })));

    // Find the target session
    const targetSession = await Session.findOne({
      _id: sessionId,
      userId: session.user.id
    });

    console.log('🔍 Found target session:', targetSession ? {
      id: targetSession._id.toString(),
      isActive: targetSession.isActive,
      lastAccessed: targetSession.lastAccessed
    } : 'Not found');

    if (!targetSession) {
      console.log('❌ Session not found or unauthorized');
      return NextResponse.json({ 
        success: false,
        message: 'Session not found or unauthorized'
      }, { status: 404 });
    }

    if (!targetSession.isActive) {
      console.log('ℹ️ Session is already inactive');
      return NextResponse.json({ 
        success: true,
        message: 'Session is already inactive'
      });
    }

    // Attempt to delete the session
    console.log('🔄 Attempting to delete session...');
    const deleteResult = await Session.findByIdAndDelete(sessionId);

    console.log('📝 Delete result:', deleteResult ? {
      id: deleteResult._id.toString(),
      wasActive: deleteResult.isActive,
      lastAccessed: deleteResult.lastAccessed
    } : 'No delete result');

    // Verify the deletion
    const verifySession = await Session.findById(sessionId);
    console.log('✅ Verification check:', verifySession ? 'Session still exists!' : 'Session successfully deleted');

    if (verifySession) {
      console.log('⚠️ Warning: Session was not properly deleted');
      return NextResponse.json({ 
        success: false,
        message: 'Failed to delete session'
      }, { status: 500 });
    }
    
    console.log('✅ Session successfully deleted');
    return NextResponse.json({ 
      success: true,
      message: 'Session ended successfully'
    });

  } catch (error) {
    console.error('❌ Error in session deletion:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to end session'
    }, { status: 500 });
  }
}
