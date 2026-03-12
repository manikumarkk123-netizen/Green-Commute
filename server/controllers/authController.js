import nodemailer from 'nodemailer';
import crypto from 'crypto';

// In-memory store for OTPs (In production, use Redis or Database)
const otpStore = new Map();

// Robust Nodemailer configuration
const createTransporter = () => {
    // Check if credentials exist
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
        return null;
    }

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD
        },
        // For debugging auth issues
        debug: true,
        logger: true 
    });
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Basic verification to block very obvious dummy domains (simple example)
        const commonDummyDomains = ['test.com', 'example.com', 'tempmail.com', 'dummy.com'];
        const domain = email.split('@')[1];
        if (commonDummyDomains.includes(domain)) {
            return res.status(400).json({ success: false, message: 'Domain not allowed. Please use a real email.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        otpStore.set(email, { otp, expiresAt });

        const transporter = createTransporter();

        if (!transporter) {
            console.log(`\n\n=== MOCK OTP EMAIL ===\nTo: ${email}\nOTP: ${otp}\n======================\n\n`);
            return res.status(200).json({ 
                success: true, 
                message: 'OTP logged to console (Backend .env missing GMAIL keys)' 
            });
        }

        const mailOptions = {
            from: `"Green Commute Auth" <${process.env.GMAIL_EMAIL}>`,
            to: email,
            subject: `${otp} is your Green Commute code`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #0f172a; padding: 30px; text-align: center;">
                            <h1 style="color: #3b82f6; margin: 0; font-size: 24px; letter-spacing: 1px;">GREEN COMMUTE</h1>
                        </div>
                        <div style="padding: 40px; text-align: center;">
                            <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 10px;">Verify Your Identity</h2>
                            <p style="color: #64748b; margin-bottom: 30px;">Use the code below to complete your action. It expires in 10 minutes.</p>
                            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f172a;">${otp}</span>
                            </div>
                            <p style="color: #94a3b8; font-size: 13px;">If you didn't request this code, please ignore this email.</p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'OTP sent to email successfully' });

    } catch (error) {
        console.error('SMTP Error:', error);
        // Fallback for development if SMTP fails but credentials might be wrong
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send OTP email. Please ensure GMAIL_APP_PASSWORD is a valid 16-character App Password.' 
        });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const record = otpStore.get(email);
        if (!record) {
            return res.status(400).json({ success: false, message: 'OTP expired or not found.' });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ success: false, message: 'OTP has expired.' });
        }

        if (record.otp !== otp.toString()) {
            return res.status(400).json({ success: false, message: 'Invalid OTP code.' });
        }

        otpStore.delete(email);
        res.status(200).json({ success: true, message: 'Email verified successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
};

// Helper: Send Welcome Email
export const sendWelcomeEmail = async (req, res) => {
    const { email, name } = req.body;
    const transporter = createTransporter();
    if (!transporter) return res.status(200).json({ success: true });

    try {
        await transporter.sendMail({
            from: `"Green Commute" <${process.env.GMAIL_EMAIL}>`,
            to: email,
            subject: 'Welcome to Green Commute! 🌍',
            html: `<h1>Hi ${name || 'User'},</h1><p>Thanks for joining the green revolution! Your account is now active.</p>`
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Welcome Email Error:', error);
        res.status(200).json({ success: true }); // Don't fail the whole request for a welcome email
    }
};

// Helper: Send Login Alert
export const sendLoginAlert = async (req, res) => {
    const { email } = req.body;
    const transporter = createTransporter();
    if (!transporter) return res.status(200).json({ success: true });

    try {
        await transporter.sendMail({
            from: `"Green Commute Security" <${process.env.GMAIL_EMAIL}>`,
            to: email,
            subject: 'New Login Detected 🛡️',
            html: `<p>A new login was detected on your Green Commute account at ${new Date().toLocaleString()}.</p>`
        });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(200).json({ success: true });
    }
};

