import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { generateOTP, sendOTPEmail } from '@/lib/otpUtils';
import { logger } from '@/lib/logger';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      } else {
        // If user exists but email not verified, delete the old record
        await User.deleteOne({ _id: existingUser._id });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (unverified)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      hashedPassword,
      isEmailVerified: false
    });

    // Generate and send OTP
    try {
      const otp = await generateOTP(email, 'signup');
      const emailSent = await sendOTPEmail(email, otp);
      
      if (!emailSent) {
        // Delete the user if email fails
        await User.deleteOne({ _id: user._id });
        logger.error(`Failed to send OTP email to: ${email}`);
        return NextResponse.json(
          { error: 'Failed to send verification email. Please try again.' },
          { status: 500 }
        );
      }

      logger.info(`New user signup initiated: ${email}`);

      return NextResponse.json({
        message: 'Please verify your email address',
        userId: user._id
      });
    } catch (error) {
      // Delete the user if OTP generation or email fails
      await User.deleteOne({ _id: user._id });
      logger.error(`Failed to generate or send OTP: ${error.message}`);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error(`Signup error: ${error.message}`);
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
