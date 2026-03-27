'use client'

import { useState, useRef, useEffect } from 'react'

const SUGGESTED = [
  "What's included with the venue?",
  'How much alcohol do we need for 100 guests?',
  'What time should the ceremony start?',
  'Can we bring our dog?',
  'What should we pack for the weekend?',
  'How does the shuttle service work?',
]

function SendIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="m22 2-7 20-4-9-9-4 20-7z" /><path d="M22 2 11 13" />
    </svg>
  )
}

function formatMessage(text) {
  // Basic markdown: **bold**, *italic*, [links](url), bullet points
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--forest);text-decoration:underline;text-underline-offset:2px">$1</a>')
    .replace(/^[-–•] (.+)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br />')
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.+?<\/li><br \/>?)+)/g, (match) => {
    const items = match.replace(/<br \/>/g, '')
    return `<ul style="padding-left:1.25em;margin:8px 0">${items}</ul>`
  })
  return html
}

export default function FamilyChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi there \u2014 I'm Sage, Rixey Manor's planning assistant. I know this place inside out \u2014 ask me anything about the venue, timelines, vendors, alcohol, what to pack, how many tables you need\u2026 whatever's on your mind.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const conversationHistory = messages
    .filter((_, i) => i > 0) // skip initial greeting
    .map(m => ({ role: m.role, content: m.content }))

  async function send(text) {
    const q = text || input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    try {
      const res = await fetch('/api/portal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, conversationHistory }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't get a response right now.",
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Having trouble connecting. Try again in a moment.',
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 52px)',
        background: 'var(--warm-white)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'white',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--sage-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--forest)' }}>S</span>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', lineHeight: 1.2 }}>Sage</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', letterSpacing: '0.05em' }}>
            Rixey Manor planning assistant
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 24px',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--sage-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginRight: 10,
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--forest)' }}>S</span>
                </div>
              )}
              <div
                style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  fontSize: 15,
                  lineHeight: 1.7,
                  fontFamily: 'var(--font-body)',
                  ...(m.role === 'user'
                    ? {
                        background: 'var(--forest)',
                        color: 'white',
                      }
                    : {
                        background: 'white',
                        border: '1px solid var(--border)',
                        color: 'var(--ink-mid)',
                      }),
                }}
                {...(m.role === 'assistant' ? { dangerouslySetInnerHTML: { __html: formatMessage(m.content) } } : {})}
              >
                {m.role === 'user' ? m.content : null}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--sage-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginRight: 10,
                  marginTop: 4,
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--forest)' }}>S</span>
              </div>
              <div style={{ background: 'white', border: '1px solid var(--border)', padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className="animate-bounce" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sage)', display: 'inline-block' }} />
                  <span className="animate-bounce" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sage)', display: 'inline-block', animationDelay: '0.15s' }} />
                  <span className="animate-bounce" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sage)', display: 'inline-block', animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--border)',
            background: 'var(--cream)',
            flexShrink: 0,
          }}
        >
          <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SUGGESTED.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 11,
                  letterSpacing: '0.04em',
                  padding: '6px 14px',
                  border: '1px solid var(--border)',
                  background: 'white',
                  color: 'var(--ink-mid)',
                  cursor: 'pointer',
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--sage)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: '12px 24px',
          borderTop: '1px solid var(--border)',
          background: 'white',
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', gap: 8 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask Sage anything about planning your Rixey weekend..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '1px solid var(--border)',
              background: 'var(--warm-white)',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              padding: '10px 14px',
              background: 'var(--forest)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              opacity: !input.trim() || loading ? 0.4 : 1,
              transition: 'opacity 150ms',
              flexShrink: 0,
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
