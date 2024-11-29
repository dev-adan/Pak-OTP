import nodemailer from 'nodemailer';
import { logger } from './logger';
import { connectDB } from '@/lib/mongodb';
import OTP from '@/models/OTP';

// Create reusable transporter object using GMAIL
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
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

// Store OTP in MongoDB
export async function storeOTP(email, otp, type = 'signup') {
  try {
    await connectDB();
    
    // Delete any existing OTP for this email and type
    await OTP.deleteMany({ 
      email: email.toLowerCase(),
      type 
    });
    
    // Create new OTP document with expiry
    const otpDoc = await OTP.create({
      email: email.toLowerCase(),
      otp,
      type,
      expiry: Date.now() + 15 * 60 * 1000, // 15 minutes
      attempts: 0,
      verified: false
    });
    
    logger.info(`OTP stored successfully. Email: ${email}, Type: ${type}`);
    return true;
  } catch (error) {
    logger.error(`Error storing OTP: ${error.message}`);
    throw error; // Propagate error to handle it in the signup flow
  }
}

// Generate a random 6-digit OTP and store it
export async function generateOTP(email, type = 'signup') {
  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP
    await storeOTP(email, otp, type);
    
    logger.info(`Generated and stored OTP for email: ${email}, Type: ${type}`);
    return otp;
  } catch (error) {
    logger.error(`Error generating OTP: ${error.message}`);
    throw error;
  }
}

// Verify OTP from MongoDB
export async function verifyOTP(email, userOTP, type = 'signup', deleteIfValid = false) {
  try {
    await connectDB();
    
    logger.info(`Verifying OTP for email: ${email}, Type: ${type}, DeleteIfValid: ${deleteIfValid}`);
    
    const otpDoc = await OTP.findOne({ 
      email: email.toLowerCase(),
      type
    });
    
    if (!otpDoc) {
      logger.warn(`No OTP found for email: ${email}`);
      return { valid: false, message: 'No OTP found for this email' };
    }
    
    if (Date.now() > otpDoc.expiry) {
      await OTP.deleteOne({ _id: otpDoc._id });
      logger.warn(`OTP has expired for email: ${email}`);
      return { valid: false, message: 'OTP has expired' };
    }
    
    if (otpDoc.otp !== userOTP) {
      // Increment attempts
      await OTP.findByIdAndUpdate(otpDoc._id, { $inc: { attempts: 1 } });
      logger.warn(`Invalid OTP attempt for ${email}. Attempts: ${otpDoc.attempts + 1}`);
      return { valid: false, message: 'Invalid OTP' };
    }
    
    // Only delete OTP if deleteIfValid is true (final password reset)
    if (deleteIfValid) {
      logger.info(`Deleting OTP after successful verification for: ${email}`);
      await OTP.deleteOne({ _id: otpDoc._id });
    } else {
      // Mark as verified but don't delete
      await OTP.findByIdAndUpdate(otpDoc._id, { verified: true });
      logger.info(`OTP marked as verified for: ${email}`);
    }

    return { valid: true, message: 'OTP verified successfully' };
  } catch (error) {
    logger.error(`Error verifying OTP: ${error.message}`);
    throw error;
  }
}

// Send OTP via email
export async function sendOTPEmail(email, otp) {
  try {
    // Check for required environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      logger.error('Missing email configuration');
      throw new Error('Email service not configured');
    }

    // Verify connection configuration
    try {
      await transporter.verify();
    } catch (error) {
      logger.error(`SMTP verification failed: ${error.message}`);
      throw new Error('Failed to connect to email service');
    }
    
    const info = await transporter.sendMail({
      from: `"Pak OTP" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5; text-align: center;">Your OTP Code</h2>
          <p style="color: #374151; font-size: 16px;">Hello,</p>
          <p style="color: #374151; font-size: 16px;">Your OTP code for registration is:</p>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${otp}</span>
          </div>
          <p style="color: #374151; font-size: 16px;">This code will expire in 15 minutes.</p>
          <p style="color: #374151; font-size: 16px;">If you didn't request this code, please ignore this email.</p>
          <div style="margin-top: 30px; text-align: center; color: #6B7280; font-size: 14px;">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `
    });

    if (!info || !info.messageId) {
      logger.error('Email sent but no message ID received');
      throw new Error('Failed to send email');
    }

    logger.info(`Email sent successfully to ${email}`);
    logger.info(`Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw error;
  }
}
