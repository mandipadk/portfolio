import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.SMTP2GO_USERNAME || !process.env.SMTP2GO_PASSWORD) {
      console.error('Missing SMTP2GO credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create transporter using SMTP2GO
    const transporter = nodemailer.createTransport({
      host: 'mail.smtp2go.com',
      port: 2525,
      secure: false,
      auth: {
        user: process.env.SMTP2GO_USERNAME,
        pass: process.env.SMTP2GO_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: {
        name: 'Portfolio Contact Form',
        address: 'contact@mandip.dev'
      },
      to: 'hello@mandip.dev',
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1e293b; color: #f8fafc;">
          <h2 style="color: #f8fafc; margin-bottom: 30px;">New Contact Form Submission</h2>
          <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong style="color: #38bdf8;">From:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #38bdf8;">Email:</strong> ${email}</p>
          </div>
          <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px;">
            <strong style="color: #38bdf8;">Message:</strong>
            <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
          </div>
        </div>
      `,
    };

    try {
      // Send email
      await transporter.sendMail(mailOptions);
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
} 