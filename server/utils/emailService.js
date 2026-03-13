import nodemailer from 'nodemailer';

const createTransporter = () => {
  // Use Mailtrap/Gmail or any SMTP
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  // Fallback: log emails to console in dev
  return null;
};

export const sendVerificationEmail = async (email, token) => {
  const transporter = createTransporter();
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${token}`;

  if (!transporter) {
    console.log('=== EMAIL VERIFICATION (Dev Mode) ===');
    console.log(`To: ${email}`);
    console.log(`Verify URL: ${verifyUrl}`);
    console.log('=====================================');
    return;
  }

  await transporter.sendMail({
    from: `"Green Commute" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your Green Commute account',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; padding: 40px; border-radius: 16px;">
        <h1 style="color: #22c55e; margin-bottom: 16px;">🌿 Green Commute</h1>
        <h2 style="color: #fff;">Verify Your Email</h2>
        <p style="color: #94a3b8;">Click the button below to verify your email and start your eco-friendly journey.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #22c55e; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">Verify Email</a>
        <p style="color: #64748b; margin-top: 24px; font-size: 12px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;

  if (!transporter) {
    console.log('=== PASSWORD RESET (Dev Mode) ===');
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('=================================');
    return;
  }

  await transporter.sendMail({
    from: `"Green Commute" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your Green Commute password',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; padding: 40px; border-radius: 16px;">
        <h1 style="color: #22c55e; margin-bottom: 16px;">🌿 Green Commute</h1>
        <h2 style="color: #fff;">Reset Your Password</h2>
        <p style="color: #94a3b8;">Click the button below to reset your password.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #22c55e; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">Reset Password</a>
        <p style="color: #64748b; margin-top: 24px; font-size: 12px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};
