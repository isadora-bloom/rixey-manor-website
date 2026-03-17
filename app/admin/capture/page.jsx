'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useAdmin } from '../layout'

const CONFIDENCE_COLOR = { high: '#2E7D54', medium: '#B8908A', low: '#aaa' }
const CONFIDENCE_LABEL = { high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' }

function ActionButton({ suggestion, file, password, onDone }) {
  const [status, setStatus] = useState('') // '' | 'loading' | 'done' | 'error'

  async function execute() {
    setStatus('loading')
    try {
      // 1. Upload the file first
      const ext = file.name.split('.').pop() || 'jpg'
      const timestamp = Date.now()
      let uploadPath

      if (suggestion.action === 'set_site_image') {
        uploadPath = `site/${suggestion.slot}.${ext}`
      } else {
        uploadPath = `gallery/capture-${timestamp}.${ext}`
      }

      const form = new FormData()
      form.append('file', file)
      form.append('path', uploadPath)
      const upRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: form,
      })
      if (!upRes.ok) throw new Error('Upload failed')
      const { url } = await upRes.json()

      // 2. Save to the right place
      if (suggestion.action === 'set_site_image') {
        const patchRes = await fetch('/api/admin/images', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
          body: JSON.stringify({ id: suggestion.slot, url, alt_text: suggestion.alt_text || '' }),
        })
        if (!patchRes.ok) throw new Error('Save failed')

      } else if (suggestion.action === 'add_to_gallery') {
        const postRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
          body: JSON.stringify({
            url,
            alt_text:   suggestion.alt_text   || '',
            scene_type: suggestion.scene_type || 'other',
            label:      suggestion.alt_text   || '',
          }),
        })
        if (!postRes.ok) throw new Error('Save failed')

      } else if (suggestion.action === 'save_testimonial') {
        // Save extracted text as a testimonial in site_content for now
        const res = await fetch('/api/admin/content', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
          body: JSON.stringify({ key: `testimonial_capture_${timestamp}`, value: suggestion.extracted_text || '' }),
        })
        if (!res.ok) throw new Error('Save failed')
      }

      setStatus('done')
      onDone && onDone(suggestion.action)
    } catch (err) {
      setStatus('error: ' + err.message)
    }
  }

  if (suggestion.action === 'ignore') return null

  const bg = status === 'done' ? '#2E7D54' : status === 'loading' ? '#aaa' : '#1C1814'

  return (
    <button
      onClick={execute}
      disabled={!!status}
      style={{
        padding: '7px 14px',
        background: bg,
        color: 'white',
        border: 'none',
        cursor: status ? 'default' : 'pointer',
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        letterSpacing: '0.08em',
        transition: 'background 0.15s',
        flexShrink: 0,
      }}
    >
      {status === 'loading' ? 'Saving…' : status === 'done' ? '✓ Done' : status.startsWith('error') ? 'Error' : suggestion.label}
    </button>
  )
}

export default function CapturePage() {
  const { password } = useAdmin()
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [analysing, setAnalysing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handleFile = useCallback(async (f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError('Please drop an image file.')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setError('')
    setAnalysing(true)

    try {
      const form = new FormData()
      form.append('file', f)
      const res = await fetch('/api/admin/capture', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalysing(false)
    }
  }, [password])

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  function reset() {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>
        Quick Capture
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 32 }}>
        Drop any image or screenshot. Claude will figure out what it is and suggest where it belongs.
      </p>

      {!file ? (
        // Drop zone
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current.click()}
          style={{
            border: `2px dashed ${dragging ? 'var(--forest)' : 'var(--border)'}`,
            background: dragging ? 'rgba(46,125,84,0.04)' : 'var(--cream)',
            padding: '64px 32px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 8, fontStyle: 'italic' }}>
            Drop an image here
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            or click to browse
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        // Analysis view
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Preview */}
          <div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--sage-light)' }}>
              <Image src={preview} alt="Uploaded" fill style={{ objectFit: 'cover' }} sizes="280px" />
            </div>
            <button
              onClick={reset}
              style={{ marginTop: 10, fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              ← Upload another
            </button>
          </div>

          {/* Analysis */}
          <div>
            {analysing && (
              <div style={{ padding: '32px 0' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Analysing…
                </p>
              </div>
            )}

            {error && (
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--rose)', marginBottom: 16 }}>
                {error}
              </p>
            )}

            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* What it sees */}
                <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '14px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 6 }}>
                    What I see
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>
                    {result.what}
                  </p>
                  {result.notes && (
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', marginTop: 6 }}>
                      {result.notes}
                    </p>
                  )}
                </div>

                {/* Extracted text */}
                {result.extracted_text && (
                  <div style={{ background: 'white', border: '1px solid var(--border)', padding: '14px 16px' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 6 }}>
                      Text found
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.7, fontStyle: 'italic' }}>
                      "{result.extracted_text}"
                    </p>
                  </div>
                )}

                {/* Suggestions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>
                    Suggestions
                  </p>
                  {(result.suggestions || []).filter(s => s.action !== 'ignore').map((s, i) => (
                    <div key={i} style={{ border: '1px solid var(--border)', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 12, background: 'white' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
                            {s.label}
                          </span>
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: CONFIDENCE_COLOR[s.confidence] }}>
                            {CONFIDENCE_LABEL[s.confidence]}
                          </span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', lineHeight: 1.5 }}>
                          {s.reason}
                          {s.slot && <span style={{ color: 'var(--sage)' }}> · slot: {s.slot}</span>}
                          {s.scene_type && <span style={{ color: 'var(--sage)' }}> · scene: {s.scene_type}</span>}
                        </p>
                      </div>
                      <ActionButton
                        suggestion={s}
                        file={file}
                        password={password}
                        onDone={() => {}}
                      />
                    </div>
                  ))}

                  {(result.suggestions || []).every(s => s.action === 'ignore') && (
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>
                      Nothing useful found for this image.
                    </p>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
