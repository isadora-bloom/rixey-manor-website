'use client'

import { useState, useRef, useEffect } from 'react'

const SUGGESTED = [
  "What's included with Rixey?",
  'How much alcohol do I need for 100 guests?',
  'What time should my ceremony start?',
  'Can we bring our dog?',
]

function SendIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="m22 2-7 20-4-9-9-4 20-7z" /><path d="M22 2 11 13" />
    </svg>
  )
}

export default function SageDemo({ apiUrl }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi — I'm Sage, Rixey's planning assistant. Ask me anything about the venue, your timeline, vendors, or wedding day logistics." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // If no API URL, show a static teaser
  if (!apiUrl) {
    return (
      <div className="border border-[var(--border)] bg-[var(--warm-white)]">
        <div className="flex items-center gap-3 px-5 py-4 bg-[var(--forest)]">
          <div className="w-2 h-2 rounded-full bg-[var(--sage-light)]" />
          <div>
            <div className="text-[12px] tracking-[0.1em] uppercase text-white"
              style={{ fontFamily: 'var(--font-ui)' }}>Sage</div>
            <div className="text-[11px] text-white/55" style={{ fontFamily: 'var(--font-ui)' }}>
              Rixey Manor planning assistant
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <p className="text-[15px] leading-[1.75] text-[var(--ink-mid)] mb-6"
            style={{ fontFamily: 'var(--font-body)' }}>
            Once you're in your portal, Sage knows your wedding — your vendors, your timeline, your guest count. Not a generic chatbot. Yours.
          </p>
          <div className="flex flex-col gap-0 border-t border-[var(--border)]">
            {SUGGESTED.map(q => (
              <div key={q}
                className="text-[13px] text-[var(--ink-light)] py-3 border-b border-[var(--border)]"
                style={{ fontFamily: 'var(--font-ui)' }}>
                "{q}"
              </div>
            ))}
          </div>
          <p className="mt-5 text-[11px] tracking-[0.1em] uppercase text-[var(--ink-light)]"
            style={{ fontFamily: 'var(--font-ui)' }}>
            Available 24 hours a day inside your portal.
          </p>
        </div>
      </div>
    )
  }

  const conversationHistory = messages
    .filter((m, i) => !(m.role === 'assistant' && i === 0))
    .map(m => ({ role: m.role, content: m.content }))

  async function send(text) {
    const q = text || input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/sage-preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, conversationHistory }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't get a response.",
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Having trouble connecting right now. Try again in a moment.',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-[var(--forest)]">
        <div className="w-2 h-2 rounded-full bg-[var(--sage-light)]" />
        <div>
          <div className="text-[12px] tracking-[0.1em] uppercase text-white"
            style={{ fontFamily: 'var(--font-ui)' }}>Sage</div>
          <div className="text-[11px] text-white/55" style={{ fontFamily: 'var(--font-ui)' }}>
            Rixey Manor planning assistant
          </div>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-[var(--sage-light)]" title="Online" />
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto px-4 py-4 space-y-3 bg-[var(--warm-white)]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[var(--forest)] text-white'
                  : 'bg-white border border-[var(--border)] text-[var(--ink-mid)]'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[var(--border)] px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-[var(--sage)] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-[var(--sage)] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-[var(--sage)] rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 flex flex-wrap gap-2 border-t border-[var(--border)] bg-[var(--cream)]">
          {SUGGESTED.map(q => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-[11px] px-3 py-1.5 border border-[var(--border)] text-[var(--ink-mid)] bg-white hover:border-[var(--sage)] transition-colors"
              style={{ fontFamily: 'var(--font-ui)', letterSpacing: '0.05em' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border)] bg-white">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask Sage anything about Rixey..."
          className="flex-1 text-[14px] border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--sage)] bg-[var(--warm-white)]"
          style={{ fontFamily: 'var(--font-body)' }}
          disabled={loading}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="p-2 bg-[var(--forest)] text-white hover:bg-[#235f3f] disabled:opacity-40 transition-colors shrink-0"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}
