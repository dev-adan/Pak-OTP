import { NextResponse } from 'next/server';
import { generateOTP, storeOTP, sendOTPEmail } from '@/lib/otpUtils';
import { logger } from '@/lib/logger';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(req) {
  try {
    const { name, email, password, isResend, isReset } = await req.json();

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    // For password reset, user must exist
    if (isReset) {
      if (!existingUser) {
        return NextResponse.json(
          { error: 'No account found with this email' },
          { status: 404 }
        );
      }
    } 
    // For registration, user must not exist (unless it's a resend)
    else if (!isResend && existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // For new registrations, validate name and password
    if (!isResend && !isReset) {
      if (!name || name.length < 2) {
        return NextResponse.json(
          { error: 'Name must be at least 2 characters long' },
          { status: 400 }
        );
      }

      if (!password || password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email.toLowerCase(), otp);

    // Send OTP email
    const emailSent = await sendOTPEmail(email.toLowerCase(), otp);
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    logger.info(`OTP ${isResend ? 're-sent' : 'generated and sent'} for ${isReset ? 'password reset' : 'registration'}: ${email}`);
    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    logger.error(`Error in send-otp: ${error.message}`);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
