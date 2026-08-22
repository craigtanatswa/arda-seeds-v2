import QRCode from "qrcode"

export async function generateInnbucksQrDataUrl(authorizationCode: string): Promise<string> {
  return QRCode.toDataURL(authorizationCode, {
    width: 240,
    margin: 1,
    errorCorrectionLevel: "M",
  })
}
