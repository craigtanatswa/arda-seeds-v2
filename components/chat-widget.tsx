"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
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
  "Hi, I am the ARDA Seeds assistant. Ask about varieties, services, hours, or how to order. For anything I cannot answer, I will share our sales numbers."

function renderMessageText(content: string) {
  const parts = content.split(/(\/contact|\/order|\/quote|\/agronomy|\/products)/g)
  return parts.map((part, index) => {
    if (part.startsWith("/")) {
      return (
        <Link key={`${part}-${index}`} href={part} className="underline font-medium text-green-800">
          {part}
        </Link>
      )
    }
    return <span key={index}>{part}</span>
  })
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
              <p className="text-xs text-green-100">Ask about seeds, services, and orders</p>
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
                    {renderMessageText(message.content)}
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
