import nodemailer from 'nodemailer';
import { logger } from './logger';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    logger.error(`SMTP connection error: ${error.message}`);
  } else {
    logger.info('SMTP server is ready to send emails');
  }
});

// Generate a random 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in MongoDB
export async function storeOTP(email, otp) {
  try {
    await connectDB();
    
    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });
    
    // Create new OTP document with expiry
    const otpDoc = await OTP.create({
      email,
      otp,
      expiry: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    
    logger.info(`OTP stored for email: ${email}, OTP: ${otp}`);
    return true;
  } catch (error) {
    logger.error(`Error storing OTP: ${error.message}`);
    return false;
  }
}

// Verify OTP from MongoDB
export async function verifyOTP(email, userOTP) {
  try {
    await connectDB();
    
    logger.info(`Verifying OTP for email: ${email}, Provided OTP: ${userOTP}`);
    
    const otpDoc = await OTP.findOne({ email });
    
    if (!otpDoc) {
      logger.warn(`No OTP found for email: ${email}`);
      return { valid: false, message: 'No OTP found for this email' };
    }
    
    logger.info(`Found OTP document: ${JSON.stringify(otpDoc)}`);
    
    if (Date.now() > otpDoc.expiry) {
      await OTP.deleteOne({ _id: otpDoc._id });
      logger.warn(`OTP has expired for email: ${email}`);
      return { valid: false, message: 'OTP has expired' };
    }
    
    if (otpDoc.otp !== userOTP) {
      logger.warn(`Invalid OTP attempt for ${email}. Expected: ${otpDoc.otp}, Received: ${userOTP}`);
      return { valid: false, message: 'Invalid OTP' };
    }
    
    // Delete the OTP after successful verification
    await OTP.deleteOne({ _id: otpDoc._id });
    logger.info(`OTP verified successfully for email: ${email}`);
    return { valid: true, message: 'OTP verified successfully' };
  } catch (error) {
    logger.error(`Error verifying OTP: ${error.message}`);
    return { valid: false, message: 'Error verifying OTP' };
  }
}

export async function sendOTPEmail(email, otp) {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your OTP for Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Thank you for registering! Please use the following OTP to complete your registration:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 15 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    });
    logger.info(`OTP sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error(`Error sending OTP email: ${error.message}`);
    return false;
  }
}
