import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import { NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';

export async function POST(req) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectDB();

    // Get user agent info
    const userAgent = req.headers.get('user-agent') || '';
    const parser = new UAParser(userAgent);
    const deviceInfo = {
      browser: parser.getBrowser().name || 'Unknown',
      os: parser.getOS().name || 'Unknown',
      device: parser.getDevice().type || 'Unknown'
    };

    // Get IP address
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : req.headers.get('x-real-ip') || 'Unknown';

    // Find active session for this user with matching device info
    const session = await Session.findOne({
      userId,
      isActive: true,
      deactivatedAt: null
    });

    if (!session) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Update last accessed time
    await Session.findByIdAndUpdate(session._id, {
      lastAccessed: new Date()
    });

    return NextResponse.json({ 
      valid: true,
      sessionId: session._id.toString() // Return the current session ID
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
