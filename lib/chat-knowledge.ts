import { allProducts } from "@/lib/product-data"
import { services } from "@/lib/service-data"
import {
  COMPANY_ADDRESS_FULL,
  COMPANY_EMAIL,
  COMPANY_HOURS_SATURDAY,
  COMPANY_HOURS_SUNDAY,
  COMPANY_HOURS_WEEKDAY,
  COMPANY_PHONE_MOBILE,
  COMPANY_PHONE_TOLL_FREE,
  getSalesHandoffMessage,
} from "@/lib/site"
import type { Product } from "@/lib/types"

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "for",
  "from",
  "how",
  "in",
  "is",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with",
  "can",
  "do",
  "does",
  "i",
  "me",
  "my",
  "you",
  "your",
  "we",
  "us",
])

const MAX_PRODUCTS = 8
const MAX_SERVICES = 2

type CompactProduct = {
  id: string
  name: string
  category: string
  shortDescription: string
  maturity: string
  yieldPotential: string
  regions: string[]
  packSizes?: { size: string; priceUsd: number }[]
}

type CompactService = {
  id: string
  name: string
  shortDescription: string
  features: string[]
}

function compactProduct(product: Product): CompactProduct {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    shortDescription: product.shortDescription,
    maturity: product.maturity,
    yieldPotential: product.yieldPotential,
    regions: product.regions,
    packSizes: product.packSizes?.map((pack) => ({ size: pack.size, priceUsd: pack.price })),
  }
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+/]+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
}

function scoreText(haystack: string, tokens: string[]): number {
  const lower = haystack.toLowerCase()
  let score = 0
  for (const token of tokens) {
    if (lower.includes(token)) {
      score += token.length > 4 ? 2 : 1
    }
  }
  return score
}

function companyFacts(): string {
  return [
    "Company: ARDA Seeds (PVT) Ltd, a leading agricultural seed supplier in Zimbabwe.",
    `Address: ${COMPANY_ADDRESS_FULL}`,
    `Sales phones: ${COMPANY_PHONE_TOLL_FREE} and ${COMPANY_PHONE_MOBILE}`,
    `Email: ${COMPANY_EMAIL}`,
    `Hours: ${COMPANY_HOURS_WEEKDAY}; ${COMPANY_HOURS_SATURDAY}; ${COMPANY_HOURS_SUNDAY}`,
    "Order seed online at /order. Request a quote at /quote. Contact form at /contact.",
    "Retail partners include Farm and City (0242 251 162) and Electrosales (08677222000) in several Zimbabwean cities.",
    "Planting guides for maize, wheat, soybeans, groundnuts, and sunflower are at /agronomy. Do not invent agronomic prescriptions; point farmers to /agronomy and sales for variety-specific advice.",
    "Crops in catalogue: maize, wheat, soybeans, groundnuts, sunflower, cowpeas, sugar beans, sorghum.",
  ].join("\n")
}

export function retrieveCompanyContext(query: string): string {
  const tokens = tokenize(query)
  const products = allProducts.map((product) => {
    const haystack = [
      product.id,
      product.name,
      product.category,
      product.shortDescription,
      product.maturity,
      product.yieldPotential,
      product.regions.join(" "),
      product.features.join(" "),
    ].join(" ")
    return { product, score: scoreText(haystack, tokens) }
  })

  const matchedProducts = products
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PRODUCTS)
    .map((entry) => compactProduct(entry.product))

  const rankedServices = services.map((service) => {
    const haystack = [service.id, service.name, service.shortDescription, service.features.join(" ")].join(" ")
    return { service, score: scoreText(haystack, tokens) }
  })

  const matchedServices: CompactService[] = rankedServices
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SERVICES)
    .map(({ service }) => ({
      id: service.id,
      name: service.name,
      shortDescription: service.shortDescription,
      features: service.features.slice(0, 4),
    }))

  const sections = [`Always-on company facts:\n${companyFacts()}`]

  if (matchedProducts.length > 0) {
    sections.push(`Matching products (retail pack prices in USD where listed):\n${JSON.stringify(matchedProducts)}`)
  } else if (tokens.some((token) => ["seed", "seeds", "product", "variety", "hybrid", "price", "prices"].includes(token))) {
    const snapshot = allProducts.slice(0, 6).map(compactProduct)
    sections.push(`Product snapshot (ask for a crop name for more):\n${JSON.stringify(snapshot)}`)
  }

  if (matchedServices.length > 0) {
    sections.push(`Matching services:\n${JSON.stringify(matchedServices)}`)
  } else if (tokens.some((token) => ["service", "services", "outgrow", "training", "transport"].includes(token))) {
    const snapshot = services.map((service) => ({
      id: service.id,
      name: service.name,
      shortDescription: service.shortDescription,
    }))
    sections.push(`Services snapshot:\n${JSON.stringify(snapshot)}`)
  }

  return sections.join("\n\n")
}

export function buildChatSystemPrompt(query: string): string {
  return `You are the ARDA Seeds website assistant for farmers and buyers in Zimbabwe.

Answer only from the knowledge below. Be concise and practical. Use US$ when quoting listed pack prices.

Do not invent stock levels, unpublished prices, discounts, delivery fees, or agronomic prescriptions that are not in the knowledge.

If the answer is missing, uncertain, about bulk or custom deals, or needs a human, tell the user to contact sales and include both phone numbers, the email, and /contact.

Handoff wording to use when you cannot answer: ${getSalesHandoffMessage()}

Knowledge:
${retrieveCompanyContext(query)}`
}
