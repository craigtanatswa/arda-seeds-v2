"use client"

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Loader2, MessageCircle, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { COMPANY_PHONE_MOBILE, COMPANY_PHONE_TOLL_FREE } from "@/lib/site"

type ChatRole = "user" | "assistant"
type ChatMessage = { role: ChatRole; content: string }

const WELCOME =
  "Hi, I am the ARDA Seeds assistant. Ask about varieties, prices, planting advice, services, or how to order. I can also help you find where to buy our seed."

const INLINE_PATTERN =
  /(\*\*[^*]+\*\*|__[^_]+__|\/(?:contact|order|quote|agronomy|products|services|tenders|careers|growers)(?:\/[a-z0-9-]+)*)/gi

/** Renders inline markdown (bold) and turns site paths into links. */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = new RegExp(INLINE_PATTERN.source, "gi")
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    const key = `${match.index}-${token}`
    if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else {
      nodes.push(
        <Link key={key} href={token} className="underline font-medium text-green-800">
          {token}
        </Link>,
      )
    }
    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; start: number; items: { text: string; level: number }[] }
  | { type: "table"; header: string[]; rows: string[][] }

const TABLE_SEPARATOR = /^\s*\|?[\s:|-]+\|[\s:|-]*$/
const HEADING_PATTERN = /^#{1,6}\s+(.*)$/
const BULLET_PATTERN = /^(\s*)[-*•]\s+(.*)$/
const ORDERED_PATTERN = /^(\s*)(\d+)[.)]\s+(.*)$/

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim())
}

/** Splits assistant output into readable blocks (headings, lists, tables, lines). */
function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n?/g, "\n").split("\n")
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    // Markdown table, kept as a safety net even though the prompt discourages it.
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i])
        i++
      }
      const header = splitTableRow(tableLines[0])
      const rows = tableLines
        .slice(1)
        .filter((row) => !TABLE_SEPARATOR.test(row))
        .map(splitTableRow)
      blocks.push({ type: "table", header, rows })
      continue
    }

    const heading = HEADING_PATTERN.exec(trimmed)
    if (heading) {
      blocks.push({ type: "heading", text: heading[1] })
      i++
      continue
    }

    const bullet = BULLET_PATTERN.exec(line)
    const ordered = ORDERED_PATTERN.exec(line)
    if (bullet || ordered) {
      const isOrdered = Boolean(ordered)
      const items: { text: string; level: number }[] = []
      const start = ordered ? Number(ordered[2]) : 1

      while (i < lines.length) {
        const nb = BULLET_PATTERN.exec(lines[i])
        const no = ORDERED_PATTERN.exec(lines[i])
        if (isOrdered && no) {
          items.push({ text: no[3], level: no[1].length >= 2 ? 1 : 0 })
        } else if (!isOrdered && nb && !no) {
          items.push({ text: nb[2], level: nb[1].length >= 2 ? 1 : 0 })
        } else {
          break
        }
        i++
      }

      blocks.push({ type: "list", ordered: isOrdered, start, items })
      continue
    }

    blocks.push({ type: "paragraph", text: trimmed })
    i++
  }

  return blocks
}

function MessageContent({ content }: { content: string }) {
  const blocks = parseBlocks(content)

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <p key={index} className="font-semibold text-green-900">
              {renderInline(block.text)}
            </p>
          )
        }

        if (block.type === "list") {
          const items = block.items.map((item, itemIndex) => (
            <li key={itemIndex} className={item.level > 0 ? "ml-4 list-[circle]" : undefined}>
              {renderInline(item.text)}
            </li>
          ))
          return block.ordered ? (
            <ol key={index} start={block.start} className="list-decimal space-y-1 pl-4">
              {items}
            </ol>
          ) : (
            <ul key={index} className="list-disc space-y-1 pl-4">
              {items}
            </ul>
          )
        }

        if (block.type === "table") {
          return (
            <div key={index} className="overflow-x-auto">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr>
                    {block.header.map((cell, cellIndex) => (
                      <th
                        key={cellIndex}
                        className="border border-green-200 bg-green-100 px-2 py-1 text-left font-semibold whitespace-nowrap"
                      >
                        {renderInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border border-green-200 px-2 py-1 whitespace-nowrap">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        return <p key={index}>{renderInline(block.text)}</p>
      })}
    </div>
  )
}

export function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [pending, setPending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: WELCOME }])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open, pending])

  if (pathname.startsWith("/admin")) {
    return null
  }

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault()
    const text = input.trim()
    if (!text || pending) return

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }]
    setMessages(nextMessages)
    setInput("")
    setPending(true)

    try {
      const history = nextMessages.filter((_, index) => index > 0)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json().catch(() => null)
      const reply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : `Please contact our sales team on ${COMPANY_PHONE_TOLL_FREE} or ${COMPANY_PHONE_MOBILE}, or visit /contact.`
      setMessages([...nextMessages, { role: "assistant", content: reply }])
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: `Please contact our sales team on ${COMPANY_PHONE_TOLL_FREE} or ${COMPANY_PHONE_MOBILE}, or visit /contact.`,
        },
      ])
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[min(520px,70vh)] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-green-100 bg-white shadow-2xl">
          <div className="flex items-start justify-between gap-3 bg-gradient-to-r from-green-700 to-emerald-700 px-4 py-3 text-white">
            <div>
              <p className="font-semibold leading-tight">ARDA Seeds Assistant</p>
              <p className="text-xs text-green-100">Seeds, prices &amp; planting advice</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              className="rounded-full p-1 text-white hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-3 p-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-green-700 text-white"
                        : "bg-green-50 text-gray-800 border border-green-100"
                    }`}
                  >
                    {message.role === "user" ? renderInline(message.content) : <MessageContent content={message.content} />}
                  </div>
                </div>
              ))}
              {pending && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <form onSubmit={sendMessage} className="border-t bg-white p-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about our seeds…"
                maxLength={800}
                disabled={pending}
                aria-label="Chat message"
              />
              <Button
                type="submit"
                size="icon"
                disabled={pending || !input.trim()}
                className="bg-green-700 hover:bg-green-800"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-[11px] text-gray-400">Powered by ARDA Seeds</p>
          </form>
        </div>
      )}

      <Button
        type="button"
        size="icon"
        className="h-14 w-14 rounded-full bg-green-700 shadow-lg hover:bg-green-800"
        aria-label={open ? "Close chat" : "Open ARDA Seeds chat"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  )
}
