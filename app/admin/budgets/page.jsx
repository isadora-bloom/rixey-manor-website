'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAdmin } from '../layout'

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI helpers — match the style of /admin/extras for consistency
// ─────────────────────────────────────────────────────────────────────────────
function btn(bg, color = 'white') {
  return {
    padding: '6px 14px', background: bg, color, border: 'none',
    cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 11,
    letterSpacing: '0.06em', flexShrink: 0,
  }
}

const inputStyle = {
  width: '100%',
  padding: '7px 10px',
  border: '1px solid var(--border)',
  fontFamily: 'var(--font-ui)',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  background: 'white',
}

const labelStyle = {
  fontFamily: 'var(--font-ui)',
  fontSize: 10,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--ink-light)',
  display: 'block',
  marginBottom: 4,
}

function Section({ title, hint, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section style={{ background: 'white', border: '1px solid var(--border)', marginBottom: 18 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'transparent',
          border: 'none', cursor: 'pointer', padding: '14px 18px',
          display: 'flex', alignItems: 'baseline', gap: 12,
          borderBottom: open ? '1px solid var(--border)' : 'none',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>{title}</span>
        {hint && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)' }}>{hint}</span>}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>
          {open ? 'Collapse' : 'Expand'}
        </span>
      </button>
      {open && <div style={{ padding: '18px' }}>{children}</div>}
    </section>
  )
}

async function api(method, body, password, query = '') {
  const res = await fetch(`/api/admin/budgets${query}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    throw new Error(j.error || 'Request failed')
  }
  return res.status === 204 ? null : res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────
function CategoriesEditor({ password, categories, setCategories }) {
  const [error, setError] = useState('')

  function update(id, patch) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  }

  async function save(cat, patch) {
    setError('')
    update(cat.id, patch)
    try {
      await api('PATCH', { _resource: 'categories', id: cat.id, ...patch }, password)
    } catch (e) {
      setError(e.message)
    }
  }

  async function add() {
    const slug = prompt('Slug (lowercase, no spaces)')
    if (!slug) return
    const name = prompt('Display name')
    if (!name) return
    try {
      const created = await api('POST', { _resource: 'categories', slug, name, sort_order: (categories.at(-1)?.sort_order || 0) + 10 }, password)
      setCategories(prev => [...prev, created])
    } catch (e) {
      setError(e.message)
    }
  }

  async function del(cat) {
    if (!confirm(`Delete category "${cat.name}"? Vendors and priority links to it will become orphaned.`)) return
    try {
      await api('DELETE', { _resource: 'categories', id: cat.id }, password)
      setCategories(prev => prev.filter(c => c.id !== cat.id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      {error && <p style={{ color: 'var(--rose)', fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <button onClick={add} style={{ ...btn('var(--forest)'), marginBottom: 14 }}>+ Add category</button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ border: '1px solid var(--border)', padding: '12px 14px', background: cat.active ? 'white' : '#faf6f0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
              <strong style={{ fontFamily: 'var(--font-ui)', fontSize: 13 }}>{cat.name}</strong>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>{cat.slug}</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button onClick={() => save(cat, { active: !cat.active })} style={btn(cat.active ? '#e8e4de' : 'var(--forest)', cat.active ? 'var(--ink)' : 'white')}>
                  {cat.active ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => del(cat)} style={btn('#b84040')}>Delete</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Range low ($)</label>
                <input type="number" value={cat.range_low ?? ''}
                  onChange={e => update(cat.id, { range_low: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
                  onBlur={() => save(cat, { range_low: cat.range_low })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Range high ($)</label>
                <input type="number" value={cat.range_high ?? ''}
                  onChange={e => update(cat.id, { range_high: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
                  onBlur={() => save(cat, { range_high: cat.range_high })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Range note</label>
                <input value={cat.range_note ?? ''}
                  placeholder='e.g. "for 100 guests"'
                  onChange={e => update(cat.id, { range_note: e.target.value })}
                  onBlur={() => save(cat, { range_note: cat.range_note })}
                  style={inputStyle} />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Description (1–2 sentences)</label>
              <textarea value={cat.description ?? ''} rows={2}
                onChange={e => update(cat.id, { description: e.target.value })}
                onBlur={() => save(cat, { description: cat.description })}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Trade-off note (italic line beneath description)</label>
              <textarea value={cat.trade_off_note ?? ''} rows={2}
                placeholder='e.g. "the place couples most often go big or trim back"'
                onChange={e => update(cat.id, { trade_off_note: e.target.value })}
                onBlur={() => save(cat, { trade_off_note: cat.trade_off_note })}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Sort order</label>
                <input type="number" value={cat.sort_order ?? 0}
                  onChange={e => update(cat.id, { sort_order: parseInt(e.target.value, 10) || 0 })}
                  onBlur={() => save(cat, { sort_order: cat.sort_order })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last reviewed (YYYY-MM-DD)</label>
                <input type="date" value={cat.last_reviewed ?? ''}
                  onChange={e => update(cat.id, { last_reviewed: e.target.value })}
                  onBlur={() => save(cat, { last_reviewed: cat.last_reviewed })}
                  style={inputStyle} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Vendors (grouped by category)
// ─────────────────────────────────────────────────────────────────────────────
function VendorsEditor({ password, categories, vendors, setVendors }) {
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [newRow, setNewRow] = useState({}) // keyed by category_slug

  const byCategory = useMemo(() => {
    const out = {}
    for (const v of vendors) {
      if (!out[v.category_slug]) out[v.category_slug] = []
      out[v.category_slug].push(v)
    }
    return out
  }, [vendors])

  function update(id, patch) {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v))
  }

  async function save(vendor, patch) {
    setError('')
    update(vendor.id, patch)
    try {
      await api('PATCH', { _resource: 'vendors', id: vendor.id, ...patch }, password)
    } catch (e) {
      setError(e.message)
    }
  }

  async function add(catSlug) {
    const draft = newRow[catSlug] || {}
    if (!draft.name) { setError('Vendor name required'); return }
    try {
      const created = await api('POST', {
        _resource: 'vendors',
        category_slug: catSlug,
        name: draft.name,
        descriptor: draft.descriptor || '',
        sort_order: (byCategory[catSlug]?.at(-1)?.sort_order || 0) + 10,
        consent_on: draft.consent_on || null,
      }, password)
      setVendors(prev => [...prev, created])
      setNewRow(prev => ({ ...prev, [catSlug]: {} }))
    } catch (e) {
      setError(e.message)
    }
  }

  async function del(vendor) {
    if (!confirm(`Remove vendor "${vendor.name}"?`)) return
    try {
      await api('DELETE', { _resource: 'vendors', id: vendor.id }, password)
      setVendors(prev => prev.filter(v => v.id !== vendor.id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      {error && <p style={{ color: 'var(--rose)', fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', marginBottom: 14 }}>
        Vendors only appear on the public page when both <strong>Active</strong> is on and a <strong>Consent date</strong> is set. Without consent the vendor is saved but not shown.
      </p>

      {categories.map(cat => {
        const list = byCategory[cat.slug] || []
        const isOpen = expanded === cat.slug
        return (
          <div key={cat.slug} style={{ border: '1px solid var(--border)', marginBottom: 8, background: 'white' }}>
            <button
              onClick={() => setExpanded(prev => prev === cat.slug ? null : cat.slug)}
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px 14px', display: 'flex', alignItems: 'baseline', gap: 10 }}
            >
              <strong style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink)' }}>{cat.name}</strong>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>
                {list.length} vendor{list.length === 1 ? '' : 's'}
                {list.length > 0 && ` · ${list.filter(v => v.consent_on).length} live`}
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
                {list.map(v => (
                  <div key={v.id} style={{ borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 130px auto', gap: 10, alignItems: 'end' }}>
                      <div>
                        <label style={labelStyle}>Vendor name</label>
                        <input value={v.name ?? ''}
                          onChange={e => update(v.id, { name: e.target.value })}
                          onBlur={() => save(v, { name: v.name })}
                          style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>One-line descriptor</label>
                        <input value={v.descriptor ?? ''}
                          onChange={e => update(v.id, { descriptor: e.target.value })}
                          onBlur={() => save(v, { descriptor: v.descriptor })}
                          style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Consent date</label>
                        <input type="date" value={v.consent_on ?? ''}
                          onChange={e => update(v.id, { consent_on: e.target.value || null })}
                          onBlur={() => save(v, { consent_on: v.consent_on })}
                          style={inputStyle} />
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => save(v, { active: !v.active })} style={btn(v.active ? '#e8e4de' : 'var(--forest)', v.active ? 'var(--ink)' : 'white')}>
                          {v.active ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => del(v)} style={btn('#b84040')}>×</button>
                      </div>
                    </div>
                    {!v.consent_on && (
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--rose)', marginTop: 6 }}>
                        Not yet shown publicly — set a consent date to publish.
                      </p>
                    )}
                  </div>
                ))}

                {/* Add new */}
                <div style={{ paddingTop: 14 }}>
                  <p style={{ ...labelStyle, marginBottom: 8 }}>Add vendor to {cat.name}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 130px auto', gap: 10, alignItems: 'end' }}>
                    <input placeholder="Vendor name"
                      value={newRow[cat.slug]?.name || ''}
                      onChange={e => setNewRow(p => ({ ...p, [cat.slug]: { ...(p[cat.slug] || {}), name: e.target.value } }))}
                      style={inputStyle} />
                    <input placeholder="One-line descriptor"
                      value={newRow[cat.slug]?.descriptor || ''}
                      onChange={e => setNewRow(p => ({ ...p, [cat.slug]: { ...(p[cat.slug] || {}), descriptor: e.target.value } }))}
                      style={inputStyle} />
                    <input type="date"
                      value={newRow[cat.slug]?.consent_on || ''}
                      onChange={e => setNewRow(p => ({ ...p, [cat.slug]: { ...(p[cat.slug] || {}), consent_on: e.target.value } }))}
                      style={inputStyle} />
                    <button onClick={() => add(cat.slug)} style={btn('var(--forest)')}>+ Add</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Priorities (chips)
// ─────────────────────────────────────────────────────────────────────────────
function PrioritiesEditor({ password, priorities, setPriorities }) {
  const [error, setError] = useState('')

  function update(id, patch) {
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))
  }

  async function save(pri, patch) {
    setError('')
    update(pri.id, patch)
    try {
      await api('PATCH', { _resource: 'priorities', id: pri.id, ...patch }, password)
    } catch (e) {
      setError(e.message)
    }
  }

  async function add() {
    const slug = prompt('Slug (lowercase, no spaces)')
    if (!slug) return
    const label = prompt('Chip label (what shows on the page)')
    if (!label) return
    try {
      const created = await api('POST', { _resource: 'priorities', slug, label, sort_order: (priorities.at(-1)?.sort_order || 0) + 10 }, password)
      setPriorities(prev => [...prev, created])
    } catch (e) {
      setError(e.message)
    }
  }

  async function del(pri) {
    if (!confirm(`Delete priority chip "${pri.label}"?`)) return
    try {
      await api('DELETE', { _resource: 'priorities', id: pri.id }, password)
      setPriorities(prev => prev.filter(p => p.id !== pri.id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      {error && <p style={{ color: 'var(--rose)', fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <button onClick={add} style={{ ...btn('var(--forest)'), marginBottom: 14 }}>+ Add priority</button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {priorities.map(pri => (
          <div key={pri.id} style={{ border: '1px solid var(--border)', padding: '10px 12px', background: pri.active ? 'white' : '#faf6f0', display: 'grid', gridTemplateColumns: '120px 160px 1fr 80px auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Slug</label>
              <input value={pri.slug ?? ''}
                onChange={e => update(pri.id, { slug: e.target.value })}
                onBlur={() => save(pri, { slug: pri.slug })}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Label</label>
              <input value={pri.label ?? ''}
                onChange={e => update(pri.id, { label: e.target.value })}
                onBlur={() => save(pri, { label: pri.label })}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description (optional)</label>
              <input value={pri.description ?? ''}
                onChange={e => update(pri.id, { description: e.target.value })}
                onBlur={() => save(pri, { description: pri.description })}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sort</label>
              <input type="number" value={pri.sort_order ?? 0}
                onChange={e => update(pri.id, { sort_order: parseInt(e.target.value, 10) || 0 })}
                onBlur={() => save(pri, { sort_order: pri.sort_order })}
                style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => save(pri, { active: !pri.active })} style={btn(pri.active ? '#e8e4de' : 'var(--forest)', pri.active ? 'var(--ink)' : 'white')}>
                {pri.active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => del(pri)} style={btn('#b84040')}>×</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Priority effects (mappings + notes)
// ─────────────────────────────────────────────────────────────────────────────
function PriorityEffectsEditor({ password, priorities, categories, priorityCategories, setPriorityCategories }) {
  const [error, setError] = useState('')
  const [draft, setDraft] = useState({ priority_slug: '', category_slug: '' })

  function update(id, patch) {
    setPriorityCategories(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }

  async function save(row, patch) {
    setError('')
    update(row.id, patch)
    try {
      await api('PATCH', { _resource: 'priorityCategories', id: row.id, ...patch }, password)
    } catch (e) {
      setError(e.message)
    }
  }

  async function add() {
    if (!draft.priority_slug || !draft.category_slug) { setError('Pick both'); return }
    try {
      const created = await api('POST', { _resource: 'priorityCategories', priority_slug: draft.priority_slug, category_slug: draft.category_slug, emphasis: 'up' }, password)
      setPriorityCategories(prev => [...prev, created])
      setDraft({ priority_slug: '', category_slug: '' })
    } catch (e) {
      setError(e.message)
    }
  }

  async function del(row) {
    if (!confirm('Delete this priority → category link?')) return
    try {
      await api('DELETE', { _resource: 'priorityCategories', id: row.id }, password)
      setPriorityCategories(prev => prev.filter(m => m.id !== row.id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      {error && <p style={{ color: 'var(--rose)', fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', marginBottom: 14 }}>
        These rows control which categories light up when a priority chip is selected. The <strong>Note</strong> field is the trade-off line that renders on the page when the chip is active. Leave the note blank if you don't have a real claim to make — the category will still be emphasized visually.
      </p>

      {/* Add new */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '12px 14px', marginBottom: 14, display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'end' }}>
        <div>
          <label style={labelStyle}>Priority</label>
          <select value={draft.priority_slug} onChange={e => setDraft(d => ({ ...d, priority_slug: e.target.value }))} style={inputStyle}>
            <option value="">…</option>
            {priorities.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={draft.category_slug} onChange={e => setDraft(d => ({ ...d, category_slug: e.target.value }))} style={inputStyle}>
            <option value="">…</option>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={add} style={btn('var(--forest)')}>+ Add link</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {priorityCategories.map(row => {
          const pri = priorities.find(p => p.slug === row.priority_slug)
          const cat = categories.find(c => c.slug === row.category_slug)
          return (
            <div key={row.id} style={{ border: '1px solid var(--border)', padding: '10px 12px', background: 'white' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '180px 80px 1fr auto', gap: 10, alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>{pri?.label || row.priority_slug} → {cat?.name || row.category_slug}</label>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>
                    {row.priority_slug} / {row.category_slug}
                  </span>
                </div>
                <div>
                  <label style={labelStyle}>Emphasis</label>
                  <select value={row.emphasis ?? 'up'}
                    onChange={e => update(row.id, { emphasis: e.target.value })}
                    onBlur={() => save(row, { emphasis: row.emphasis })}
                    style={inputStyle}>
                    <option value="up">Up</option>
                    <option value="down">Down</option>
                    <option value="flag">Flag</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Note (renders only if filled)</label>
                  <input value={row.note ?? ''}
                    placeholder='e.g. "couples who prioritize food typically push catering toward the upper end"'
                    onChange={e => update(row.id, { note: e.target.value })}
                    onBlur={() => save(row, { note: row.note })}
                    style={inputStyle} />
                </div>
                <button onClick={() => del(row)} style={btn('#b84040')}>×</button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page-level total
// ─────────────────────────────────────────────────────────────────────────────
function TotalEditor({ password, total, setTotal }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  function field(k) {
    return e => setTotal(prev => ({ ...prev, [k]: e.target.value }))
  }

  async function save() {
    setSaving(true); setError(''); setStatus('')
    try {
      await api('PATCH', { _resource: 'total', updates: total }, password)
      setStatus('Saved')
      setTimeout(() => setStatus(''), 2500)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', marginBottom: 14 }}>
        These render at the bottom of <strong>/what-it-costs</strong>. If both numbers are blank, the soft total section doesn't appear at all.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={labelStyle}>Total low ($)</label>
          <input type="number" value={total.what_it_costs_total_low ?? ''} onChange={field('what_it_costs_total_low')} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Total high ($)</label>
          <input type="number" value={total.what_it_costs_total_high ?? ''} onChange={field('what_it_costs_total_high')} style={inputStyle} />
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <label style={labelStyle}>Total note</label>
        <input value={total.what_it_costs_total_note ?? ''}
          placeholder='e.g. "for 100 guests, spring Saturday. Tuesday and off-peak run lower."'
          onChange={field('what_it_costs_total_note')}
          style={inputStyle} />
      </div>
      <div style={{ marginTop: 14 }}>
        <label style={labelStyle}>Total caveat (italic line)</label>
        <input value={total.what_it_costs_total_caveat ?? ''}
          placeholder='e.g. "Plan for ~10% in vendor tips on top of these ranges."'
          onChange={field('what_it_costs_total_caveat')}
          style={inputStyle} />
      </div>
      <div style={{ marginTop: 14 }}>
        <label style={labelStyle}>Last reviewed (YYYY-MM-DD)</label>
        <input type="date" value={total.what_it_costs_last_reviewed ?? ''} onChange={field('what_it_costs_last_reviewed')} style={inputStyle} />
      </div>

      <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={save} disabled={saving} style={btn('var(--forest)')}>{saving ? 'Saving…' : 'Save total'}</button>
        {status && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--forest)' }}>{status}</span>}
        {error && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--rose)' }}>{error}</span>}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function BudgetsAdminPage() {
  const { password } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [categories, setCategories]                 = useState([])
  const [priorities, setPriorities]                 = useState([])
  const [priorityCategories, setPriorityCategories] = useState([])
  const [vendors, setVendors]                       = useState([])
  const [total, setTotal]                           = useState({})

  useEffect(() => {
    if (!password) return
    api('GET', null, password, '?resource=all')
      .then(data => {
        setCategories(data.categories || [])
        setPriorities(data.priorities || [])
        setPriorityCategories(data.priorityCategories || [])
        setVendors(data.vendors || [])
        setTotal(data.total || {})
      })
      .catch(e => setLoadError(e.message))
      .finally(() => setLoading(false))
  }, [password])

  return (
    <div style={{ maxWidth: 980 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>
        Budgets
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 24 }}>
        Manages the data behind <strong>/what-it-costs</strong>. Empty fields render cleanly on the public page (nothing fabricated). Vendors only go live with both <strong>active</strong> and a <strong>consent date</strong>.
      </p>

      {loading && <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>Loading…</p>}
      {loadError && (
        <p style={{ color: 'var(--rose)', fontFamily: 'var(--font-ui)', fontSize: 13, marginBottom: 18 }}>
          Couldn't load: {loadError}. Has the <code>add_budget_tables.sql</code> migration been run in Supabase?
        </p>
      )}

      {!loading && !loadError && (
        <>
          <Section title="Page total" hint="Renders at the bottom of /what-it-costs.">
            <TotalEditor password={password} total={total} setTotal={setTotal} />
          </Section>

          <Section title="Categories" hint={`${categories.length} category lines on the page.`}>
            <CategoriesEditor password={password} categories={categories} setCategories={setCategories} />
          </Section>

          <Section title="Vendors" hint={`${vendors.filter(v => v.consent_on && v.active).length} live · ${vendors.filter(v => !v.consent_on).length} awaiting consent.`}>
            <VendorsEditor password={password} categories={categories} vendors={vendors} setVendors={setVendors} />
          </Section>

          <Section title="Priorities (chips)" hint={`${priorities.length} chips at the top of the page.`} defaultOpen={false}>
            <PrioritiesEditor password={password} priorities={priorities} setPriorities={setPriorities} />
          </Section>

          <Section title="Priority effects (chip → category)" hint="Which categories highlight when a chip is on; optional trade-off line per pair." defaultOpen={false}>
            <PriorityEffectsEditor
              password={password}
              priorities={priorities}
              categories={categories}
              priorityCategories={priorityCategories}
              setPriorityCategories={setPriorityCategories}
            />
          </Section>
        </>
      )}
    </div>
  )
}
