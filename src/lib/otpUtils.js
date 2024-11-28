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

// Generate a random 6-digit OTP and store it
export async function generateOTP(email) {
  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP
    const stored = await storeOTP(email, otp);
    if (!stored) {
      throw new Error('Failed to store OTP');
    }
    
    logger.info(`Generated and stored OTP for email: ${email}`);
    return otp;
  } catch (error) {
    logger.error(`Error generating OTP: ${error.message}`);
    throw error;
  }
}

// Store OTP in MongoDB
export async function storeOTP(email, otp) {
  try {
    await connectDB();
    
    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase() });
    
    // Create new OTP document with expiry
    const otpDoc = await OTP.create({
      email: email.toLowerCase(),
      otp,
      expiry: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    
    logger.info(`OTP stored successfully. Email: ${email}, OTP: ${otp}`);
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
    
    const otpDoc = await OTP.findOne({ email: email.toLowerCase() });
    
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

// Send OTP via email
export async function sendOTPEmail(email, otp) {
  try {
    // Verify connection configuration
    await transporter.verify();
    
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

    logger.info(`Email sent successfully to ${email}`);
    logger.info(`Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    return false;
  }
}
