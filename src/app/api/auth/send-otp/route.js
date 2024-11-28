import { NextResponse } from 'next/server';
import { generateOTP, storeOTP, sendOTPEmail } from '@/lib/otpUtils';
import { logger } from '@/lib/logger';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { name, email, password, isResend } = await req.json();

    // Validate input
    if (!email || (!isResend && (!name || !password))) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Only validate password for new registrations
    if (!isResend) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Check if user exists only for new registrations
    if (!isResend) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        );
      }
    }

    // Generate and store OTP
    const otp = generateOTP();
    const stored = await storeOTP(email.toLowerCase(), otp);
    if (!stored) {
      return NextResponse.json(
        { error: 'Failed to store OTP' },
        { status: 500 }
      );
    }

    // Send OTP via email
    const emailSent = await sendOTPEmail(email.toLowerCase(), otp);
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    logger.info(`OTP ${isResend ? 're-sent' : 'generated and sent'} for ${isResend ? 'verification' : 'registration'}: ${email}`);
    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    logger.error(`Error in send-otp: ${error.message}`);
    return NextResponse.json(
      { error: 'An error occurred while sending OTP' },
      { status: 500 }
    );
  }
}
