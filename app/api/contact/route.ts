import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json()

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      )
    }

    // Create transporter — configure your SMTP settings in .env.local
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 2525,
        secure: process.env.SMTP_SECURE === "true", // corrected
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        });

    // Email to ARDA Seeds
    await transporter.sendMail({
      from: `"ARDA Seeds Website" <${process.env.SENDER_EMAIL}>`,
      to: "customerexperience@ardaseeds.co.zw",
      replyTo: email,
      subject: `[Customer Enquiry] ${subject} — from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #16a34a, #059669); padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Customer Enquiry</h1>
            <p style="color: #d1fae5; margin: 8px 0 0;">Received via ardaseeds.co.zw</p>
          </div>
          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; width: 140px; vertical-align: top;">Name:</td>
                <td style="padding: 10px 0; color: #4b5563;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Email:</td>
                <td style="padding: 10px 0; color: #4b5563;"><a href="mailto:${email}" style="color: #16a34a;">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Phone:</td>
                <td style="padding: 10px 0; color: #4b5563;">${phone}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Subject:</td>
                <td style="padding: 10px 0; color: #4b5563;">${subject}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-weight: bold; color: #374151; margin: 0 0 10px;">Message:</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af;">
              Reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
      `,
    })

    // Auto-reply to the customer
    await transporter.sendMail({
      from: `"ARDA Seeds" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "We received your enquiry — ARDA Seeds.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #16a34a, #059669); padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You, ${name}!</h1>
            <p style="color: #d1fae5; margin: 8px 0 0;">We've received your message.</p>
          </div>
          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 16px;">
              Thank you for reaching out to ARDA Seeds. Our customer experience team has received your enquiry regarding <strong>${subject}</strong> and will get back to you as soon as possible.
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
              Our business hours are Monday–Friday 8:00 AM–5:00 PM and Saturday 8:00 AM–12:00 PM. We aim to respond within one business day.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              If your enquiry is urgent, please call us at <strong>0242 704 924/5</strong> or <strong>+263 71 149 6082</strong>.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              ARDA Seeds | 3 Mchlery, Eastlea, Harare, Zimbabwe<br/>
              customerexperience@ardaseeds.co.zw
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    )
  }
}
