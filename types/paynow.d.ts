declare module "paynow" {
  export class Payment {
    constructor(reference: string, authEmail?: string)
    add(title: string, amount: number, quantity?: number): Payment
    info(): string
    total(): number
    authEmail?: string
  }

  export class InitResponse {
    success: boolean
    hasRedirect: boolean
    redirectUrl?: string
    pollUrl?: string
    error?: string
    status: string
    instructions?: string
    isInnbucks?: boolean
    innbucks_info?: {
      authorizationcode: string
      deep_link_url: string
      qr_code: string
      expires_at: string
    }[]
  }

  export class StatusResponse {
    reference?: string
    amount?: string
    paynowReference?: string
    pollUrl?: string
    status?: string
    error?: string
  }

  export class Paynow {
    constructor(
      integrationId: string,
      integrationKey: string,
      resultUrl?: string,
      returnUrl?: string
    )
    resultUrl: string
    returnUrl: string
    createPayment(reference: string, authEmail?: string): Payment
    send(payment: Payment): Promise<InitResponse | void>
    sendMobile(
      payment: Payment,
      phone: string,
      method: string
    ): Promise<InitResponse | void>
    verifyHash(values: Record<string, string>): boolean
    pollTransaction(url: string): Promise<StatusResponse>
  }
}
