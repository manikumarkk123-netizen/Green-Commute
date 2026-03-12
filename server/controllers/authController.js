import nodemailer from 'nodemailer';
import crypto from 'crypto';

// In-memory store for OTPs (In production, use Redis or Database)
// Structure: { 'email@example.com': { otp: '123456', expiresAt: 1700000000000 } }
const otpStore = new Map();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        
        // Expiration: 10 minutes from now
        const expiresAt = Date.now() + 10 * 60 * 1000;
        
        otpStore.set(email, { otp, expiresAt });

        // If credentials are not set, just mock it (useful for local dev without email setup)
        if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
            console.log(`\n\n=== MOCK OTP EMAIL ===\nTo: ${email}\nOTP: ${otp}\n======================\n\n`);
            return res.status(200).json({ 
                success: true, 
                message: 'OTP sent successfully (Mocked in console since GMAIL env vars are missing)' 
            });
        }

        const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: 'Your Green Commute Security Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #0b0c10; padding: 20px; text-align: center;">
                        <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">Green Commute</h1>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                        <h2 style="color: #1e293b; margin-top: 0;">Verification Code</h2>
                        <p style="color: #64748b; font-size: 16px; line-height: 1.5;">Please use the following 6-digit code to verify your email address. This code is valid for 10 minutes.</p>
                        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 15px; text-align: center; margin: 25px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a;">${otp}</span>
                        </div>
                        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 0;">If you didn't request this code, you can safely ignore this email.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'OTP sent to email successfully' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP email' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const record = otpStore.get(email);

        if (!record) {
            return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new one.' });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (record.otp !== otp.toString()) {
            return res.status(400).json({ success: false, message: 'Invalid OTP code' });
        }

        // Verification successful, delete OTP to prevent reuse
        otpStore.delete(email);
        
        res.status(200).json({ success: true, message: 'Email verified successfully' });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
};
