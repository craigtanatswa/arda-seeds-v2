import { allProducts } from "@/lib/product-data"
import { services } from "@/lib/service-data"
import { retrieveAgronomyContext } from "@/lib/chat-agronomy"
import {
  COMPANY_ADDRESS_FULL,
  COMPANY_AGRO_DEALERS,
  COMPANY_EMAIL,
  COMPANY_FACTORY_WAREHOUSE,
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
    `Head office: ${COMPANY_ADDRESS_FULL}. 1 Lytton is the head office and administrative base.`,
    COMPANY_FACTORY_WAREHOUSE,
    "Important: the 1 Lytton head office and the Chitungwiza Factory and Warehouse are two DIFFERENT locations. Never treat them as the same address, and always say which one you mean.",
    `Sales phones: ${COMPANY_PHONE_TOLL_FREE} and ${COMPANY_PHONE_MOBILE}`,
    `Email: ${COMPANY_EMAIL}`,
    `Hours: ${COMPANY_HOURS_WEEKDAY}; ${COMPANY_HOURS_SATURDAY}; ${COMPANY_HOURS_SUNDAY}`,
    "Where to buy seed:",
    "- Walk in at the Chitungwiza Factory and Warehouse.",
    "- Order online at /order.",
    "- Buy from our retail partners and agro-dealers in all 10 provinces.",
    COMPANY_AGRO_DEALERS,
    "Request a quote at /quote. Contact form at /contact.",
    "Retail partners include Farm and City (0242 251 162) and Electrosales (08677222000) in several Zimbabwean cities.",
    "Planting guides for maize, wheat, soybeans, groundnuts and sunflower are at /agronomy. Agronomic knowledge for the crops a user asks about is provided further below.",
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

  const agronomy = retrieveAgronomyContext(query)
  if (agronomy) {
    sections.push(agronomy)
  }

  if (matchedProducts.length > 0) {
    sections.push(
      `Matching products (retail pack prices in USD where listed; varieties of the same crop often share identical prices - state a shared price once instead of repeating it per variety):\n${JSON.stringify(matchedProducts)}`,
    )
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
  return `You are the ARDA Seeds website assistant, helping farmers, growers and buyers in Zimbabwe with our seed varieties, pack prices, agronomic advice, services and ordering.

HOW TO ORGANISE EVERY REPLY (very important):
- Use short, scannable lines. Never write long blocks of prose.
- Never use Markdown tables and never use the pipe "|" character.
- Open with a one-sentence direct answer.
- Start list lines with "- " and steps with "1. ", one point per line.
- Use "**Heading**" on its own line only to group a few related lines.
- Keep lines short (about 60 characters or less) so they read well in the chat bubble.
- When several varieties share identical pack prices, list the prices once and say which varieties they cover. Never repeat the same price list per variety.
- Write money as US$ (for example US$89.00 for a 25kg pack).
- End with at most one short next step or question. No sign-off or signature.
- Keep replies under about 120 words unless the user asks for a detailed guide, in which case use headings and short bullets.

HOW TO ANSWER:
- The KNOWLEDGE below is your source of truth for ARDA products, prices, services and company details.
- Be proactive and genuinely helpful: give your best complete answer first.
- Only hand off to sales for bulk or contract pricing, credit terms, tenders, complaints, order-specific problems, or something genuinely not covered. Do not send people to sales when you can answer.
- Never invent stock levels, discounts, delivery fees, order statuses or prices that are not in the KNOWLEDGE.
- If you use widely accepted agronomic practice that is not from our published guides, label it briefly as general guidance.
- Where to buy seed: in person at our Factory and Warehouse in Chitungwiza, online at /order, from our retail partners, or from agro-dealers in all 10 provinces.
- Locations: 1 Lytton (Workington, Harare) is our head office. Chitungwiza is a separate site. Never mix the two addresses, and name the location you mean.
- Give agronomic advice freely when asked about planting, growing, fertilising, weeds, pests, diseases, harvest or storage.
- Link pages as plain paths, for example /products, /order, /quote, /contact, /agronomy.

Only when you truly need a person, use this wording once, briefly: ${getSalesHandoffMessage()}

Knowledge:
${retrieveCompanyContext(query)}`
}
