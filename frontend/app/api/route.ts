import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Basic in-memory rate limiting (Note: not perfect for serverless/edge environments but better than nothing)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5; // 5 requests
const WINDOW_MS = 60 * 1000; // per minute

export async function POST(req: Request) {
  // console.log("API endpoint called");

  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (record && now - record.lastReset < WINDOW_MS) {
      if (record.count >= RATE_LIMIT) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many requests. Please try again later.",
          },
          { status: 429 },
        );
      }
      record.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    }

    // Validate environment variables
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      // console.error("Missing email environment variables");
      return NextResponse.json(
        { success: false, error: "Email service not configured" },
        { status: 500 },
      );
    }

    const { name, email, message } = await req.json();
    // console.log("Received data:", { name, email, message });

    // Validate required fields
    if (!name || !email || !message) {
      // console.log("Missing required fields");
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // console.log("Invalid email format");
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    // console.log("Sending email...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      subject: `New Contact Form Message from ${escapeHtml(name)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00FFFF;">New Contact Form Submission</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #00FFFF;">
              ${escapeHtml(message).replace(/\n/g, "<br>")}
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
      text: `New Contact Form Message\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully");

    const response = {
      success: true,
      message: "Email sent successfully",
    };
    // console.log("Sending response:", response);

    return NextResponse.json(response);
  } catch (error) {
    // console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email. Please try again later.",
      },
      { status: 500 },
    );
  }
}
