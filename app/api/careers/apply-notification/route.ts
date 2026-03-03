import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const { applicantName, position, email, phone } = await req.json()

    if (!applicantName || !position || !email) {
      return NextResponse.json(
        { error: "Missing required fields for notification." },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 2525,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"ARDA Seeds Careers" <${process.env.SENDER_EMAIL}>`,
      to: "customerexperience@ardaseeds.co.zw",
      replyTo: email,
      subject: `[Career Application] ${position} — ${applicantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #16a34a, #059669); padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Career Application</h1>
            <p style="color: #d1fae5; margin: 8px 0 0;">Received via ardaseeds.co.zw</p>
          </div>
          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; width: 160px; vertical-align: top;">Applicant:</td>
                <td style="padding: 10px 0; color: #4b5563;">${applicantName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Position:</td>
                <td style="padding: 10px 0; color: #4b5563;">${position}</td>
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
            </table>
            <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af;">
              View full application and documents in the Admin panel.
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Careers apply notification error:", error)
    return NextResponse.json(
      { error: "Failed to send notification." },
      { status: 500 }
    )
  }
}
