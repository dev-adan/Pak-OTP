import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otpUtils';
import { logger } from '@/lib/logger';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password, otp } = await req.json();
    
    logger.info(`Received OTP verification request for email: ${email}`);

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Join OTP digits if it's an array
    const otpString = Array.isArray(otp) ? otp.join('') : otp;
    
    logger.info(`Verifying OTP: ${otpString} for email: ${email}`);

    const result = await verifyOTP(email, otpString);

    if (!result.valid) {
      logger.warn(`OTP verification failed: ${result.message}`);
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`User already exists with email: ${email}`);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    logger.info(`User created successfully: ${email}`);

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    logger.error(`Error in OTP verification: ${error.message}`);
    return NextResponse.json(
      { error: 'Error verifying OTP' },
      { status: 500 }
    );
  }
}
