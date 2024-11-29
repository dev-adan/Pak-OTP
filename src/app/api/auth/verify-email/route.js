import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyOTP } from '@/lib/otpUtils';
import { logger } from '@/lib/logger';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify OTP
    const verificationResult = await verifyOTP(email, otp);
    if (!verificationResult.valid) {
      return NextResponse.json(
        { error: verificationResult.message },
        { status: 400 }
      );
    }

    // Update user verification status
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isEmailVerified: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    logger.info(`Email verified successfully for user: ${email}`);

    return NextResponse.json({
      message: 'Email verified successfully',
      verified: true
    });

  } catch (error) {
    logger.error(`Email verification error: ${error.message}`);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
