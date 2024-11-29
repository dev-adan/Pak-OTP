import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { generateOTP, verifyOTP, sendOTPEmail } from '@/lib/otpUtils';
import { logger } from '@/lib/logger';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp, newPassword, step } = body;

    logger.info(`Password reset request - Step: ${step}, Email: ${email}`);

    await connectDB();

    // Step 1: Initiate password reset
    if (step === 'initiate') {
      if (!email) {
        logger.warn('Email missing in initiate step');
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        logger.warn(`No user found for email: ${email}`);
        return NextResponse.json(
          { error: 'No account found with this email' },
          { status: 404 }
        );
      }

      // Generate and send OTP with type 'reset'
      const otp = await generateOTP(email, 'reset');
      await sendOTPEmail(email, otp);

      logger.info(`Password reset OTP sent for user: ${email}`);
      return NextResponse.json({
        message: 'Password reset code sent to your email'
      });
    }

    // Step 2: Verify OTP only
    if (step === 'verify') {
      if (!email || !otp) {
        logger.warn('Missing fields in verify step');
        return NextResponse.json(
          { error: 'Email and verification code are required' },
          { status: 400 }
        );
      }

      // Verify OTP with type 'reset'
      const verificationResult = await verifyOTP(email, otp, 'reset');
      if (!verificationResult.valid) {
        logger.warn(`OTP verification failed: ${verificationResult.message}`);
        return NextResponse.json(
          { error: verificationResult.message },
          { status: 400 }
        );
      }

      logger.info(`OTP verified successfully for: ${email}`);
      return NextResponse.json({
        message: 'Verification code is valid'
      });
    }

    // Step 3: Reset password with verified OTP
    if (step === 'reset') {
      logger.info('Processing password reset request');

      if (!email || !otp || !newPassword) {
        const missing = [];
        if (!email) missing.push('email');
        if (!otp) missing.push('verification code');
        if (!newPassword) missing.push('new password');
        
        const error = `Missing required fields: ${missing.join(', ')}`;
        logger.warn(error);
        return NextResponse.json({ error }, { status: 400 });
      }

      // Verify OTP again with type 'reset'
      const verificationResult = await verifyOTP(email, otp, 'reset');
      if (!verificationResult.valid) {
        logger.warn(`Final OTP verification failed: ${verificationResult.message}`);
        return NextResponse.json(
          { error: verificationResult.message },
          { status: 400 }
        );
      }

      // Validate password
      if (newPassword.length < 8) {
        const error = 'Password must be at least 8 characters long';
        logger.warn(error);
        return NextResponse.json({ error }, { status: 400 });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      const user = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { 
          hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null
        }
      );

      if (!user) {
        logger.warn(`User not found during password update: ${email}`);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      logger.info(`Password reset successful for user: ${email}`);
      return NextResponse.json({
        message: 'Password reset successful'
      });
    }

    logger.warn(`Invalid step received: ${step}`);
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
