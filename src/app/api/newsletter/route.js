import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Creating transporter with:', {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, ''), // Remove spaces from password
    });

    // Create transporter with exact same configuration as contact form
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, ''), // Remove spaces from password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    try {
      console.log('Attempting to send notification email...');
      
      // Email to admin about new subscriber
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: 'New Newsletter Subscription',
        html: `
          <h2>New Newsletter Subscriber</h2>
          <p>Email: ${email}</p>
          <p>Date: ${new Date().toLocaleString()}</p>
        `,
      });

      console.log('Attempting to send welcome email...');

      // Confirmation email to subscriber
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Welcome to Our Newsletter!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Welcome to Our Newsletter! 🎉</h2>
            <p>Thank you for subscribing to our newsletter. We're excited to have you join our community!</p>
            <p>You'll receive updates about:</p>
            <ul>
              <li>Latest security insights</li>
              <li>Product updates</li>
              <li>Industry news</li>
              <li>Tips and best practices</li>
            </ul>
            <p style="color: #666;">If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">© 2024 Your Company. All rights reserved.</p>
          </div>
        `,
      });

      console.log('Both emails sent successfully');

      return NextResponse.json(
        { success: true, message: 'Subscription successful' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Email sending error:', {
        message: emailError.message,
        stack: emailError.stack,
      });
      return NextResponse.json(
        { error: 'Failed to send confirmation email. Please check your email address and try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Newsletter subscription error:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}
