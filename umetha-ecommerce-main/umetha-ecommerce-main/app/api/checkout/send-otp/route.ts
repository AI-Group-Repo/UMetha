import { NextRequest, NextResponse } from 'next/server';

// In production, you should use a proper email service like SendGrid, AWS SES, or Nodemailer
// For now, we'll store OTPs in memory. In production, use a cache like Redis
const otpStore = new Map<string, { code: string; expiresAt: number; email: string }>();

// Generate a 5-digit OTP
function generateOTP(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Send OTP via email
async function sendOTPEmail(email: string, code: string) {
  // TODO: Implement actual email sending using your preferred email service
  // Example with Nodemailer, SendGrid, or AWS SES
  
  console.log(`OTP for ${email}: ${code}`);
  
  // For now, we'll log it. In production, use a real email service:
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 587,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
  // });
  
  // await transporter.sendMail({
  //   from: 'UMetha <noreply@umetha.com>',
  //   to: email,
  //   subject: 'Your OTP Verification Code',
  //   html: `
  //     <h2>Verify Your Email</h2>
  //     <p>Your verification code is: <strong>${code}</strong></p>
  //     <p>This code will expire in 10 minutes.</p>
  //   `
  // });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Generate OTP
    const code = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    // Store OTP
    otpStore.set(email, { code, expiresAt, email });
    
    // Send OTP via email
    await sendOTPEmail(email, code);
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, include the OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp: code })
    });
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

// Verify OTP
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;
    
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }
    
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return NextResponse.json(
        { error: 'OTP not found or expired' },
        { status: 404 }
      );
    }
    
    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }
    
    // Verify OTP
    if (storedData.code === code) {
      // Remove OTP after successful verification
      otpStore.delete(email);
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid OTP code' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}


