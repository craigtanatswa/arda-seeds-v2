import { randomInt } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import {
  maizeProducts,
  wheatProducts,
  soybeanProducts,
  groundnutProducts,
  sunflowerProducts,
  cowpeaProducts,
  sugarBeanProducts,
  sorghumProducts,
} from "@/lib/product-data"
import { totalQuantityKg } from "@/lib/pack-size"
import type { Product, QuoteRequest } from "@/lib/types"

const allProducts: Product[] = [
  ...maizeProducts,
  ...wheatProducts,
  ...soybeanProducts,
  ...groundnutProducts,
  ...sunflowerProducts,
  ...cowpeaProducts,
  ...sugarBeanProducts,
  ...sorghumProducts,
]

function getProductName(productId: string): string {
  return allProducts.find((p) => p.id === productId)?.name ?? productId
}

function isValidQuoteLine(item: QuoteRequest["products"][number]) {
  const product = allProducts.find((p) => p.id === item.productId)
  if (!product?.packSizes?.length || item.packCount < 1) return false
  return product.packSizes.some((pack) => pack.size === item.packSize)
}

function normalizeQuoteLine(item: QuoteRequest["products"][number]) {
  const computedTotal = totalQuantityKg(item.packSize, item.packCount)
  return {
    ...item,
    totalQuantityKg: computedTotal,
  }
}

function buildProductRows(products: QuoteRequest["products"]): string {
  return products
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 8px; color: #374151;">${getProductName(item.productId)}</td>
        <td style="padding: 10px 8px; color: #374151; text-align: center;">${item.packSize}</td>
        <td style="padding: 10px 8px; color: #374151; text-align: center;">${item.packCount}</td>
        <td style="padding: 10px 8px; color: #374151; text-align: center;">${item.totalQuantityKg} kg</td>
      </tr>`
    )
    .join("")
}

export async function POST(req: NextRequest) {
  try {
    const body: QuoteRequest = await req.json()
    const { fullName, email, phone, company, address, products, message } = body

    const validProducts = products?.filter(isValidQuoteLine).map(normalizeQuoteLine)

    if (!fullName || !email || !phone || !address || !validProducts?.length) {
      return NextResponse.json(
        { error: "All required fields and at least one product with pack size are required." },
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

    const quoteRef = `QTE-${randomInt(100000, 999999)}`
    const productRows = buildProductRows(validProducts)

    const productTableHead = `
      <tr style="background: #f3f4f6;">
        <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Product</th>
        <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Pack Size</th>
        <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">No. of Packs</th>
        <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Total Qty</th>
      </tr>`

    // Email to ARDA Seeds
    await transporter.sendMail({
      from: `"ARDA Seeds Website" <${process.env.SENDER_EMAIL}>`,
      to: "customerexperience@ardaseeds.co.zw",
      replyTo: email,
      subject: `[Quote Request] ${quoteRef} — ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 660px; margin: 0 auto;">
          <div style="background: #15803d; padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">New Quote Request Received</h1>
            <p style="color: #bbf7d0; margin: 6px 0 0; font-size: 14px;">Reference: ${quoteRef}</p>
          </div>
          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="font-size: 16px; color: #111827; margin: 0 0 16px;">Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr><td style="padding: 6px 0; font-weight: bold; color: #374151; width: 140px;">Name:</td><td style="padding: 6px 0; color: #4b5563;">${fullName}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Email:</td><td style="padding: 6px 0; color: #4b5563;"><a href="mailto:${email}" style="color: #15803d;">${email}</a></td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 6px 0; color: #4b5563;">${phone}</td></tr>
              ${company ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Company/Farm:</td><td style="padding: 6px 0; color: #4b5563;">${company}</td></tr>` : ""}
              <tr><td style="padding: 6px 0; font-weight: bold; color: #374151;">Address:</td><td style="padding: 6px 0; color: #4b5563;">${address}</td></tr>
            </table>

            <h2 style="font-size: 16px; color: #111827; margin: 0 0 12px;">Requested Products</h2>
            <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px;">
              <thead>${productTableHead}</thead>
              <tbody>${productRows}</tbody>
            </table>

            ${message ? `
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-weight: bold; color: #374151; margin: 0 0 10px;">Additional Message:</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            ` : ""}

            <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
              Please respond to the customer at <a href="mailto:${email}" style="color: #15803d;">${email}</a> or call ${phone} with a quotation.
            </p>
          </div>
        </div>
      `,
    })

    // Confirmation email to customer
    await transporter.sendMail({
      from: `"ARDA Seeds" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: `We received your quote request — ${quoteRef}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #15803d; padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Thank You, ${fullName}!</h1>
            <p style="color: #bbf7d0; margin: 8px 0 0; font-size: 14px;">Reference: ${quoteRef}</p>
          </div>
          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; line-height: 1.6; margin: 0 0 16px;">
              Thank you for your interest in ARDA Seeds products. We have received your quote request and our team will review it and get back to you with a detailed quotation within <strong>24–48 business hours</strong>.
            </p>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="font-weight: bold; color: #374151; margin: 0 0 12px;">Your Request Summary</p>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #e5e7eb;">
                    <th style="padding: 8px 4px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Product</th>
                    <th style="padding: 8px 4px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Pack Size</th>
                    <th style="padding: 8px 4px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Packs</th>
                    <th style="padding: 8px 4px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Total Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${validProducts.map((item) => `
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                      <td style="padding: 8px 4px; color: #374151;">${getProductName(item.productId)}</td>
                      <td style="padding: 8px 4px; color: #374151; text-align: center;">${item.packSize}</td>
                      <td style="padding: 8px 4px; color: #374151; text-align: center;">${item.packCount}</td>
                      <td style="padding: 8px 4px; color: #374151; text-align: center;">${item.totalQuantityKg} kg</td>
                    </tr>`).join("")}
                </tbody>
              </table>
            </div>

            <p style="color: #6b7280; font-size: 13px; margin: 0 0 4px;">
              If you have any questions in the meantime, please contact us:
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

    return NextResponse.json({ success: true, quoteRef })
  } catch (error) {
    console.error("Quote request error:", error)
    return NextResponse.json(
      { error: "Failed to submit quote request. Please try again or contact us directly." },
      { status: 500 }
    )
  }
}
