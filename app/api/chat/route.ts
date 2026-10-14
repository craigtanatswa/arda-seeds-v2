import { NextRequest, NextResponse } from "next/server"
import { buildChatSystemPrompt } from "@/lib/chat-knowledge"
import { getSalesHandoffMessage } from "@/lib/site"

type ChatRole = "user" | "assistant"
type ChatMessage = { role: ChatRole; content: string }

const MAX_HISTORY = 8
const MAX_MESSAGE_LENGTH = 800
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 12

const hitsByIp = new Map<string, { count: number; resetAt: number }>()

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const existing = hitsByIp.get(ip)
  if (!existing || existing.resetAt <= now) {
    hitsByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  existing.count += 1
  return existing.count > RATE_LIMIT_MAX
}

function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return []
  return input
    .filter((item): item is ChatMessage => {
      if (!item || typeof item !== "object") return false
      const role = (item as ChatMessage).role
      const content = (item as ChatMessage).content
      return (role === "user" || role === "assistant") && typeof content === "string"
    })
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content.length > 0)
    .slice(-MAX_HISTORY)
}

function salesFallback(status = 200) {
  return NextResponse.json({ reply: getSalesHandoffMessage() }, { status })
}

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(clientIp(req))) {
      return NextResponse.json(
        { reply: getSalesHandoffMessage(), error: "rate_limited" },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => null)
    const messages = normalizeMessages(body?.messages)
    const lastUser = [...messages].reverse().find((message) => message.role === "user")

    if (!lastUser) {
      return NextResponse.json({ error: "Please send a message." }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return salesFallback()
    }

    const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b"
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 500,
        messages: [
          { role: "system", content: buildChatSystemPrompt(lastUser.content) },
          ...messages,
        ],
      }),
    })

    if (!groqResponse.ok) {
      return salesFallback(groqResponse.status === 429 ? 429 : 200)
    }

    const data = await groqResponse.json()
    const reply = data?.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      return salesFallback()
    }

    return NextResponse.json({ reply })
  } catch {
    return salesFallback()
  }
}
