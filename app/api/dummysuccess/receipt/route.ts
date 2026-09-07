import { NextResponse } from "next/server"
import { generateOrderReceiptPdf } from "@/lib/order-receipt-pdf"
import { receiptDownloadFilename } from "@/lib/order-receipt-service"
import { DUMMY_SUCCESS_RECEIPT } from "@/lib/dummy-success-order"

export async function GET() {
  try {
    const pdfBytes = await generateOrderReceiptPdf(DUMMY_SUCCESS_RECEIPT)
    const filename = receiptDownloadFilename(DUMMY_SUCCESS_RECEIPT.orderRef)

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Dummy receipt error:", error)
    return NextResponse.json({ error: "Failed to generate receipt" }, { status: 500 })
  }
}
