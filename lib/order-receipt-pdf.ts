import { readFile } from "fs/promises"
import path from "path"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { COMPANY_ADDRESS_FULL } from "@/lib/site"
import { SALES_INBOX } from "@/lib/mail"
import {
  formatFulfillmentLabel,
  type OrderReceiptInput,
} from "@/lib/order-receipt"

const GREEN = rgb(0.082, 0.502, 0.239)
const DARK = rgb(0.067, 0.094, 0.153)
const MUTED = rgb(0.42, 0.447, 0.502)
const BORDER = rgb(0.898, 0.906, 0.922)

function formatReceiptDate(paidAt: string | null): string {
  const date = paidAt ? new Date(paidAt) : new Date()
  return date.toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export async function generateOrderReceiptPdf(
  input: OrderReceiptInput
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89])
  const { width, height } = page.getSize()
  const margin = 48
  const contentWidth = width - margin * 2

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const logoPath = path.join(process.cwd(), "public", "images", "ardalogo.png")
  const logoBytes = await readFile(logoPath)
  const logoImage = await pdfDoc.embedPng(logoBytes)
  const logoScale = Math.min(140 / logoImage.width, 48 / logoImage.height)
  const logoWidth = logoImage.width * logoScale
  const logoHeight = logoImage.height * logoScale

  let y = height - margin

  page.drawImage(logoImage, {
    x: margin,
    y: y - logoHeight,
    width: logoWidth,
    height: logoHeight,
  })

  page.drawText("Payment Receipt", {
    x: width - margin - fontBold.widthOfTextAtSize("Payment Receipt", 20),
    y: y - 24,
    size: 20,
    font: fontBold,
    color: DARK,
  })

  page.drawText(input.orderRef, {
    x: width - margin - font.widthOfTextAtSize(input.orderRef, 11),
    y: y - 42,
    size: 11,
    font,
    color: MUTED,
  })

  y -= logoHeight + 28

  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: BORDER,
  })

  y -= 24

  page.drawText("ARDA Seeds (Private) Limited", {
    x: margin,
    y,
    size: 11,
    font: fontBold,
    color: DARK,
  })
  y -= 16
  page.drawText(COMPANY_ADDRESS_FULL, {
    x: margin,
    y,
    size: 10,
    font,
    color: MUTED,
  })
  y -= 14
  page.drawText(`Date: ${formatReceiptDate(input.paidAt)}`, {
    x: margin,
    y,
    size: 10,
    font,
    color: MUTED,
  })

  y -= 28

  page.drawText("Customer", {
    x: margin,
    y,
    size: 12,
    font: fontBold,
    color: DARK,
  })
  y -= 18

  const customerLines = [
    `${input.firstName} ${input.lastName}`,
    input.email,
    input.phone,
    formatFulfillmentLabel(input),
  ]

  for (const line of customerLines) {
    page.drawText(line, {
      x: margin,
      y,
      size: 10,
      font,
      color: DARK,
    })
    y -= 14
  }

  y -= 12

  const colProduct = margin
  const colPack = margin + 220
  const colQty = margin + 290
  const colUnit = margin + 340
  const colTotal = width - margin - 60

  page.drawRectangle({
    x: margin,
    y: y - 18,
    width: contentWidth,
    height: 20,
    color: rgb(0.953, 0.957, 0.965),
  })

  const headerY = y - 14
  page.drawText("Product", { x: colProduct + 6, y: headerY, size: 9, font: fontBold, color: MUTED })
  page.drawText("Pack", { x: colPack, y: headerY, size: 9, font: fontBold, color: MUTED })
  page.drawText("Qty", { x: colQty, y: headerY, size: 9, font: fontBold, color: MUTED })
  page.drawText("Unit", { x: colUnit, y: headerY, size: 9, font: fontBold, color: MUTED })
  page.drawText("Total", { x: colTotal, y: headerY, size: 9, font: fontBold, color: MUTED })

  y -= 28

  for (const item of input.lines) {
    page.drawText(item.productName.slice(0, 36), {
      x: colProduct + 6,
      y,
      size: 10,
      font,
      color: DARK,
    })
    page.drawText(item.packSize, { x: colPack, y, size: 10, font, color: DARK })
    page.drawText(String(item.quantity), { x: colQty, y, size: 10, font, color: DARK })
    page.drawText(`US$ ${item.unitPrice.toFixed(2)}`, {
      x: colUnit,
      y,
      size: 10,
      font,
      color: DARK,
    })
    page.drawText(`US$ ${item.lineTotal.toFixed(2)}`, {
      x: colTotal,
      y,
      size: 10,
      font,
      color: DARK,
    })

    y -= 18
    page.drawLine({
      start: { x: margin, y: y + 6 },
      end: { x: width - margin, y: y + 6 },
      thickness: 0.5,
      color: BORDER,
    })
  }

  y -= 8
  const totalLabel = "Order Total:"
  const totalValue = `US$ ${input.total.toFixed(2)}`
  page.drawText(totalLabel, {
    x: colUnit - fontBold.widthOfTextAtSize(totalLabel, 12),
    y,
    size: 12,
    font: fontBold,
    color: DARK,
  })
  page.drawText(totalValue, {
    x: colTotal,
    y,
    size: 12,
    font: fontBold,
    color: GREEN,
  })

  y -= 36

  page.drawText("Thank you for your order.", {
    x: margin,
    y,
    size: 10,
    font,
    color: DARK,
  })
  y -= 14
  page.drawText(
    "Our sales team will notify you when your order is ready for collection.",
    {
      x: margin,
      y,
      size: 10,
      font,
      color: MUTED,
    }
  )
  y -= 14
  page.drawText("We will also email you progress updates on your delivery.", {
    x: margin,
    y,
    size: 10,
    font,
    color: MUTED,
  })

  const footerY = margin + 36
  page.drawLine({
    start: { x: margin, y: footerY + 18 },
    end: { x: width - margin, y: footerY + 18 },
    thickness: 1,
    color: BORDER,
  })
  page.drawText("086 125 588  |  +263 71 149 6082", {
    x: margin,
    y: footerY,
    size: 9,
    font,
    color: MUTED,
  })
  page.drawText(SALES_INBOX, {
    x: margin,
    y: footerY - 12,
    size: 9,
    font,
    color: MUTED,
  })

  return pdfDoc.save()
}
