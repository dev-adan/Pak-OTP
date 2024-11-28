import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otpUtils';
import { logger } from '@/lib/logger';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { name, email, password, otp, isReset } = await req.json();
    
    logger.info(`Received OTP verification request for email: ${email}, type: ${isReset ? 'reset' : 'registration'}`);

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Join OTP digits if it's an array
    const otpString = Array.isArray(otp) ? otp.join('') : otp;
    
    logger.info(`Verifying OTP: ${otpString} for email: ${email}`);

    // Ensure MongoDB connection
    await connectDB();

    // Verify OTP first
    const result = await verifyOTP(email.toLowerCase(), otpString);

    if (!result.valid) {
      logger.warn(`OTP verification failed: ${result.message}`);
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    // For password reset, we don't need to create a user
    if (isReset) {
      return NextResponse.json(
        { message: 'OTP verified successfully' },
        { status: 200 }
      );
    }

    // For registration, check if user exists and create new user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user - password will be hashed by the pre-save middleware
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Raw password - will be hashed by pre-save middleware
      role: 'user'
    });

    logger.info(`User created successfully: ${email}`);
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name
        }
      },
      { status: 201 }
    );

  } catch (error) {
    logger.error(`Error in verify-otp: ${error.message}`);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
