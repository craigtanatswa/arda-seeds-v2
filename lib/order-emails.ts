import type { ValidatedOrderLine } from "@/lib/order-validation"
import { createMailTransporter, SALES_INBOX, senderFrom } from "@/lib/mail"

type PaidOrderEmailInput = {
  orderRef: string
  firstName: string
  lastName: string
  email: string
  phone: string
  collectionName: string
  collectionCity: string
  collectionAddress: string | null
  lines: ValidatedOrderLine[]
  total: number
}

function itemRows(lines: ValidatedOrderLine[]) {
  return lines
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 8px; color: #374151;">${item.productName}</td>
        <td style="padding: 10px 8px; color: #374151; text-align: center;">${item.packSize}</td>
        <td style="padding: 10px 8px; color: #374151; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 8px; color: #374151; text-align: right;">US$ ${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 10px 8px; font-weight: bold; color: #374151; text-align: right;">US$ ${item.lineTotal.toFixed(2)}</td>
      </tr>`
    )
    .join("")
}

export async function sendPaidOrderEmails(input: PaidOrderEmailInput) {
  const transporter = createMailTransporter()
  const fullName = `${input.firstName} ${input.lastName}`
  const collectionLabel = `${input.collectionName}, ${input.collectionCity}${
    input.collectionAddress ? ` (${input.collectionAddress})` : ""
  }`

  await transporter.sendMail({
    from: senderFrom("ARDA Seeds Website"),
    to: SALES_INBOX,
    replyTo: input.email,
    subject: `[Paid Seed Order] ${input.orderRef} — ${fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 660px; margin: 0 auto;">
        <div style="background: #15803d; padding: 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Paid Seed Order Received</h1>
          <p style="color: #bbf7d0; margin: 6px 0 0; font-size: 14px;">Reference: ${input.orderRef}</p>
        </div>
        <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 16px; color: #111827; margin: 0 0 16px;">Customer Information</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 6px 0; font-weight: bold; color: #374151; width: 140px;">Name:</td><td style="padding: 6px 0; color: #4b5563;">${fullName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Email:</td><td style="padding: 6px 0; color: #4b5563;"><a href="mailto:${input.email}" style="color: #15803d;">${input.email}</a></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 6px 0; color: #4b5563;">${input.phone}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Collection:</td><td style="padding: 6px 0; color: #4b5563;">${collectionLabel}</td></tr>
          </table>
          <h2 style="font-size: 16px; color: #111827; margin: 0 0 12px;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; margin-bottom: 16px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #6b7280;">Product</th>
                <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #6b7280;">Pack</th>
                <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #6b7280;">Qty</th>
                <th style="padding: 10px 8px; text-align: right; font-size: 12px; color: #6b7280;">Unit</th>
                <th style="padding: 10px 8px; text-align: right; font-size: 12px; color: #6b7280;">Total</th>
              </tr>
            </thead>
            <tbody>${itemRows(input.lines)}</tbody>
            <tfoot>
              <tr style="background: #f9fafb;">
                <td colspan="4" style="padding: 12px 8px; font-weight: bold; text-align: right;">Order Total:</td>
                <td style="padding: 12px 8px; font-weight: bold; color: #15803d; text-align: right;">US$ ${input.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">Manage this order in the Sales Admin dashboard.</p>
        </div>
      </div>
    `,
  })

  await transporter.sendMail({
    from: senderFrom(),
    to: input.email,
    subject: `Payment received — ARDA Seeds order ${input.orderRef}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #15803d; padding: 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Thank you, ${input.firstName}!</h1>
          <p style="color: #bbf7d0; margin: 8px 0 0; font-size: 14px;">Reference: ${input.orderRef}</p>
        </div>
        <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #374151; line-height: 1.6;">
            We have received your payment for your seed order. Our sales team will prepare your order for collection at:
          </p>
          <p style="color: #111827; font-weight: bold; margin: 16px 0;">${collectionLabel}</p>
          <p style="color: #374151; line-height: 1.6;">
            You will receive another email when your order is ready for collection.
          </p>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #e5e7eb;">
                  <th style="padding: 8px 4px; text-align: left; font-size: 12px; color: #6b7280;">Product</th>
                  <th style="padding: 8px 4px; text-align: center; font-size: 12px; color: #6b7280;">Size</th>
                  <th style="padding: 8px 4px; text-align: center; font-size: 12px; color: #6b7280;">Qty</th>
                  <th style="padding: 8px 4px; text-align: right; font-size: 12px; color: #6b7280;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${input.lines
                  .map(
                    (item) => `
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 8px 4px; color: #374151;">${item.productName}</td>
                    <td style="padding: 8px 4px; text-align: center;">${item.packSize}</td>
                    <td style="padding: 8px 4px; text-align: center;">${item.quantity}</td>
                    <td style="padding: 8px 4px; text-align: right;">US$ ${item.lineTotal.toFixed(2)}</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 10px 4px; font-weight: bold; text-align: right;">Order Total:</td>
                  <td style="padding: 10px 4px; font-weight: bold; color: #15803d; text-align: right;">US$ ${input.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p style="color: #6b7280; font-size: 13px;">
            Phone: <strong>0242 704 924/5</strong> | <strong>+263 71 149 6082</strong><br/>
            Email: <a href="mailto:${SALES_INBOX}" style="color: #15803d;">${SALES_INBOX}</a>
          </p>
        </div>
      </div>
    `,
  })
}
