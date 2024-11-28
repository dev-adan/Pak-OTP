import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { verifyOTP } from '@/lib/otpUtils';

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    // Validate input
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify OTP
    const isValidOTP = await verifyOTP(email.toLowerCase(), otp);
    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Find user and update password
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user's password
    await User.updateOne(
      { email: email.toLowerCase() },
      { $set: { password: hashedPassword } }
    );

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'An error occurred while resetting password' },
      { status: 500 }
    );
  }
}
