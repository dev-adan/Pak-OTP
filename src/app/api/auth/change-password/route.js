import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { logger } from '@/lib/logger';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      logger.error('Missing required fields');
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user from database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      logger.error(`User not found: ${session.user.email}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isValid) {
      logger.warn(`Invalid current password attempt for user: ${session.user.email}`);
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.findByIdAndUpdate(user._id, {
      hashedPassword: hashedPassword,
      updatedAt: new Date()
    });

    logger.info(`Password changed successfully for user: ${session.user.email}`);
    return NextResponse.json({ 
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error(`Error changing password: ${error.message}`);
    return NextResponse.json(
      { error: 'Failed to change password. Please try again.' },
      { status: 500 }
    );
  }
}
