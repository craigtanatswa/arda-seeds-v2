export const COMPANY_ADDRESS = "1 Lytton, Workington, Harare"
export const COMPANY_ADDRESS_FULL = `${COMPANY_ADDRESS}, Zimbabwe`

/**
 * The Chitungwiza Factory and Warehouse is a separate site from the 1 Lytton
 * head office. Keep the two locations distinct in customer-facing copy.
 */
export const COMPANY_FACTORY_WAREHOUSE =
  "ARDA Seeds has a Factory and Warehouse in Chitungwiza, a separate location from the 1 Lytton head office, where customers can also buy seed in person."

export const COMPANY_AGRO_DEALERS =
  "ARDA Seeds seed is also available from multiple agro-dealers in all 10 provinces of Zimbabwe."

export const COMPANY_PHONE_TOLL_FREE = "086 125 588"
export const COMPANY_PHONE_MOBILE = "+263 71 149 6082"
export const COMPANY_EMAIL = "customerexperience@ardaseeds.co.zw"

export const COMPANY_HOURS_WEEKDAY = "Monday - Friday: 8:00 AM - 5:00 PM"
export const COMPANY_HOURS_SATURDAY = "Saturday: 8:00 AM - 12:00 PM"
export const COMPANY_HOURS_SUNDAY = "Sunday: Closed"

export function getSalesHandoffMessage() {
  return `I don't have enough information to answer that. Please contact our sales team on ${COMPANY_PHONE_TOLL_FREE} or ${COMPANY_PHONE_MOBILE}, email ${COMPANY_EMAIL}, or visit /contact.`
}
