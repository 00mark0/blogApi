import { findUserByEmail } from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import pool from "../config/db.js"; // Ensure you import your database pool

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      html: `
        <p>Dear ${user.username},</p>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you,</p>
        <p>MyBlog</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      decoded.id,
    ]);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
