import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import type { CartItem } from "@/lib/types"

interface OrderBody {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  items: CartItem[]
  total: number
}

function buildItemRows(items: CartItem[]): string {
  return items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 8px; color: #374151;">${item.productName}</td>
        <td style="padding: 10px 8px; color: #374151; text-align: center;">${item.packSize}</td>
        <td style="padding: 10px 8px; color: #374151; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 8px; color: #374151; text-align: right;">US$ ${item.pricePerUnit.toFixed(2)}</td>
        <td style="padding: 10px 8px; font-weight: bold; color: #374151; text-align: right;">US$ ${(item.pricePerUnit * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("")
}

function buildItemText(items: CartItem[]): string {
  return items
    .map(
      (item) =>
        `  - ${item.productName} (${item.packSize}) x${item.quantity} = US$ ${(item.pricePerUnit * item.quantity).toFixed(2)}`
    )
    .join("\n")
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderBody = await req.json()
    const { firstName, lastName, email, phone, address, items, total } = body

    if (!firstName || !lastName || !email || !phone || !address || !items?.length) {
      return NextResponse.json(
        { error: "All fields and at least one item are required." },
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

    const fullName = `${firstName} ${lastName}`
    const itemRows = buildItemRows(items)
    const itemText = buildItemText(items)
    const orderRef = `ORD-${Date.now()}`

    // ── Email to ARDA Seeds ──────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"ARDA Seeds Website" <${process.env.SENDER_EMAIL}>`,
      to: "customerexperience@ardaseeds.co.zw",
      replyTo: email,
      subject: `[New Seed Order] ${orderRef} — ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 660px; margin: 0 auto;">
          <div style="background: #15803d; padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">New Seed Order Received</h1>
            <p style="color: #bbf7d0; margin: 6px 0 0; font-size: 14px;">Reference: ${orderRef}</p>
          </div>
          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="font-size: 16px; color: #111827; margin: 0 0 16px;">Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr><td style="padding: 6px 0; font-weight: bold; color: #374151; width: 120px;">Name:</td><td style="padding: 6px 0; color: #4b5563;">${fullName}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Email:</td><td style="padding: 6px 0; color: #4b5563;"><a href="mailto:${email}" style="color: #15803d;">${email}</a></td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 6px 0; color: #4b5563;">${phone}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Address:</td><td style="padding: 6px 0; color: #4b5563;">${address}</td></tr>
            </table>

            <h2 style="font-size: 16px; color: #111827; margin: 0 0 12px;">Order Items</h2>
            <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Product</th>
                  <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Pack Size</th>
                  <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Qty</th>
                  <th style="padding: 10px 8px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase;">Unit Price</th>
                  <th style="padding: 10px 8px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase;">Line Total</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
              <tfoot>
                <tr style="background: #f9fafb;">
                  <td colspan="4" style="padding: 12px 8px; font-weight: bold; color: #111827; text-align: right;">Order Total:</td>
                  <td style="padding: 12px 8px; font-weight: bold; color: #15803d; text-align: right; font-size: 16px;">US$ ${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Please respond to the customer at <a href="mailto:${email}" style="color: #15803d;">${email}</a> or call ${phone} to confirm the order.
            </p>
          </div>
        </div>
      `,
    })

    // ── Confirmation email to customer ───────────────────────────────────────
    await transporter.sendMail({
      from: `"ARDA Seeds" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: `Your ARDA Seeds Order Confirmation — ${orderRef}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #15803d; padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Thank You for Your Order, ${firstName}!</h1>
            <p style="color: #bbf7d0; margin: 8px 0 0; font-size: 14px;">Reference: ${orderRef}</p>
          </div>
          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; line-height: 1.6; margin: 0 0 16px;">
              We have received your seed order and our sales team will be in touch with you very shortly. We typically respond within <strong>less than 24 hours</strong> during business days to confirm availability, delivery details, and payment arrangements.
            </p>
            <p style="color: #374151; line-height: 1.6; margin: 0 0 24px;">
              In the meantime, here is a summary of what you ordered:
            </p>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #e5e7eb;">
                    <th style="padding: 8px 4px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Product</th>
                    <th style="padding: 8px 4px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Size</th>
                    <th style="padding: 8px 4px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Qty</th>
                    <th style="padding: 8px 4px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item) => `
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                      <td style="padding: 8px 4px; color: #374151;">${item.productName}</td>
                      <td style="padding: 8px 4px; color: #374151; text-align: center;">${item.packSize}</td>
                      <td style="padding: 8px 4px; color: #374151; text-align: center;">${item.quantity}</td>
                      <td style="padding: 8px 4px; color: #374151; text-align: right;">US$ ${(item.pricePerUnit * item.quantity).toFixed(2)}</td>
                    </tr>`).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding: 10px 4px; font-weight: bold; color: #111827; text-align: right;">Order Total:</td>
                    <td style="padding: 10px 4px; font-weight: bold; color: #15803d; text-align: right;">US$ ${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p style="color: #4b5563; font-size: 14px; margin: 0 0 8px;">
              <strong>Delivery Address:</strong> ${address}
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

            <p style="color: #6b7280; font-size: 13px; margin: 0 0 4px;">
              If you have any questions before we get back to you, please contact us:
            </p>
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 4px;">
              Phone: <strong>0242 704 924/5</strong> | <strong>+263 71 149 6082</strong>
            </p>
            <p style="color: #6b7280; font-size: 13px; margin: 0;">
              Email: <a href="mailto:customerexperience@ardaseeds.co.zw" style="color: #15803d;">customerexperience@ardaseeds.co.zw</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              ARDA Seeds (Private) Limited | 3 Mchlery, Eastlea, Harare, Zimbabwe
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, orderRef })
  } catch (error) {
    console.error("Order submission error:", error)
    return NextResponse.json(
      { error: "Failed to place order. Please try again or contact us directly." },
      { status: 500 }
    )
  }
}
