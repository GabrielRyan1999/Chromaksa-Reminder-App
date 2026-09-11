"use server";

import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // We don't want to reveal if an email exists or not for security reasons
    // But for this simple MVP, we can return success anyway.
    if (!user) {
      return { success: true }; 
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Expires in 1 hour
    const expiresAt = new Date(Date.now() + 3600000);

    // Invalidate existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Save new token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // Construct reset link
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

    // Send email
    await transporter.sendMail({
      from: `"Reminder App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div>
          <h2>Reset Your Password</h2>
          <p>We received a request to reset your password.</p>
          <p>Click the link below to choose a new password:</p>
          <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#ef4444;color:white;text-decoration:none;border-radius:5px;margin-top:10px;">Reset Password</a>
          <p style="margin-top:20px;font-size:12px;color:#666;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to request password reset:", error);
    return { error: "An internal server error occurred." };
  }
}

export async function updatePassword(token: string, newPassword: string) {
  try {
    if (!token) return { error: "Missing token" };
    if (newPassword.length < 6) return { error: "Password must be at least 6 characters" };

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { error: "Invalid or expired token" };
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return { error: "Token has expired. Please request a new one." };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    });

    // Delete token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update password:", error);
    return { error: "An internal server error occurred." };
  }
}
