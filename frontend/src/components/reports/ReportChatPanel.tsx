import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, ReportContext } from '@/types'
import { chatService } from '@/services/chatService'
import { SUGGESTED_QUESTIONS } from '@/services/mock/reportExplainer'
import { Spinner } from '@/components/common/Spinner'

export function ReportChatPanel({ context }: { context: ReportContext }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([])
    chatService.openingMessage(context).then((m) => setMessages([m]))
  }, [context.report.id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  async function send(text: string) {
    if (!text.trim() || thinking) return
    const userMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)
    try {
      const reply = await chatService.ask(text, context)
      setMessages((prev) => [...prev, reply])
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1l-5 1 1-5a8.38 8.38 0 0 1-1-4 8.5 8.5 0 0 1 17-.5Z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-ink">Report Assistant</p>
          <p className="text-[11px] text-ink-faint">Rule-based · scoped to this report · no external data access</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-brand text-white' : 'border border-border bg-surface-elevated text-ink'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-2">
              <Spinner size={12} />
              <span className="text-xs text-ink-faint">Reading report fields…</span>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] text-ink-muted transition-colors hover:border-brand hover:text-brand"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex gap-2 border-t border-border-subtle p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this report…"
          className="flex-1 rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          disabled={thinking || !input.trim()}
          className="rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dim disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
