import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { generateOTP, verifyOTP, sendOTPEmail } from '@/lib/otpUtils';
import { logger } from '@/lib/logger';

export async function POST(req) {
  try {
    const { email, otp, newPassword, step } = await req.json();

    await connectDB();

    // Step 1: Initiate password reset
    if (step === 'initiate') {
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json(
          { error: 'No account found with this email' },
          { status: 404 }
        );
      }

      // Generate and send OTP
      const otp = await generateOTP(email);
      await sendOTPEmail(email, otp);

      logger.info(`Password reset initiated for user: ${email}`);

      return NextResponse.json({
        message: 'Password reset OTP sent to your email'
      });
    }

    // Step 2: Verify OTP and set new password
    if (step === 'reset') {
      if (!email || !otp || !newPassword) {
        return NextResponse.json(
          { error: 'All fields are required' },
          { status: 400 }
        );
      }

      // Verify OTP
      const verificationResult = await verifyOTP(email, otp);
      if (!verificationResult.valid) {
        return NextResponse.json(
          { error: verificationResult.message },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { 
          hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null
        }
      );

      logger.info(`Password reset successful for user: ${email}`);

      return NextResponse.json({
        message: 'Password reset successful'
      });
    }

    return NextResponse.json(
      { error: 'Invalid step' },
      { status: 400 }
    );

  } catch (error) {
    logger.error(`Password reset error: ${error.message}`);
    return NextResponse.json(
      { error: 'Failed to process password reset' },
      { status: 500 }
    );
  }
}
