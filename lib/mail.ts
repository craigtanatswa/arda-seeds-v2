import nodemailer from "nodemailer"

export function createMailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 2525,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

/** True when the SMTP settings needed to send mail are present. */
export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SENDER_EMAIL
  )
}

export const SALES_INBOX = "customerexperience@ardaseeds.co.zw"

export function senderFrom(name = "ARDA Seeds") {
  return `"${name}" <${process.env.SENDER_EMAIL}>`
}
