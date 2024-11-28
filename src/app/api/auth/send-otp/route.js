import { NextResponse } from 'next/server';
import { generateOTP, sendOTPEmail } from '@/lib/otpUtils';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { logger } from '@/lib/logger';

export async function POST(req) {
  try {
    const { email, name, password, isReset, isResend, isSignup } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // For registration, validate name and password
    if (!isReset && !isResend) {
      if (!name) {
        return NextResponse.json(
          { error: 'Name is required' },
          { status: 400 }
        );
      }
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required' },
          { status: 400 }
        );
      }
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    // For password reset, user must exist
    if (isReset && !user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // For new registration (not resend), user must not exist
    if (!isReset && !isResend && user) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // For signup OTP resend, ensure it's the same signup flow
    if (isResend && isSignup && user) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // For reset OTP resend, ensure user exists
    if (isResend && !isSignup && !user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    try {
      // Generate and store OTP
      const otp = await generateOTP(email.toLowerCase());
      
      // Send OTP email
      await sendOTPEmail(email.toLowerCase(), otp, isReset);

      logger.info(`OTP sent successfully to ${email}`);
      return NextResponse.json(
        { message: 'OTP sent successfully' },
        { status: 200 }
      );
    } catch (error) {
      logger.error(`Error generating or sending OTP: ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error(`Error in send-otp: ${error.message}`);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
