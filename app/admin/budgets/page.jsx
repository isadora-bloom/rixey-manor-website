'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAdmin } from '../layout'

// ─── shared helpers ──────────────────────────────────────────────────────────
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

// ─── Categories + nested Options + nested Vendors ────────────────────────────
function CategoriesEditor({
  password,
  categories, setCategories,
  options, setOptions,
  vendors, setVendors,
}) {
  const [error, setError] = useState('')
  const [openCat, setOpenCat] = useState(null)
  const [openOpt, setOpenOpt] = useState(null)
  const [newCat, setNewCat] = useState({ slug: '', name: '' })
  const [newOptByCat, setNewOptByCat] = useState({})       // { catSlug: { slug, label } }
  const [newVendorByOpt, setNewVendorByOpt] = useState({}) // { optionId: { name, descriptor, consent_on } }

  const optionsByCat = useMemo(() => {
    const out = {}
    for (const o of options) {
      if (!out[o.category_slug]) out[o.category_slug] = []
      out[o.category_slug].push(o)
    }
    return out
  }, [options])

  const vendorsByOpt = useMemo(() => {
    const out = {}
    for (const v of vendors) {
      if (!out[v.option_id]) out[v.option_id] = []
      out[v.option_id].push(v)
    }
    return out
  }, [vendors])

  // ── category ops
  function patchCat(id, patch) { setCategories(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c)) }
  async function saveCat(cat, patch) {
    setError(''); patchCat(cat.id, patch)
    try { await api('PATCH', { _resource: 'categories', id: cat.id, ...patch }, password) }
    catch (e) { setError(e.message) }
  }
  async function addCat() {
    if (!newCat.slug || !newCat.name) { setError('Slug and name required'); return }
    try {
      const created = await api('POST', { _resource: 'categories', ...newCat, sort_order: (categories.at(-1)?.sort_order || 0) + 10 }, password)
      setCategories(prev => [...prev, created])
      setNewCat({ slug: '', name: '' })
    } catch (e) { setError(e.message) }
  }
  async function delCat(cat) {
    if (!confirm(`Delete category "${cat.name}"? All its options and vendors will also be deleted.`)) return
    try {
      await api('DELETE', { _resource: 'categories', id: cat.id }, password)
      setCategories(prev => prev.filter(c => c.id !== cat.id))
      setOptions(prev => prev.filter(o => o.category_slug !== cat.slug))
      // vendors cascade via option deletion in DB; refresh-style filter for consistency
      const optionIdsGone = options.filter(o => o.category_slug === cat.slug).map(o => o.id)
      setVendors(prev => prev.filter(v => !optionIdsGone.includes(v.option_id)))
    } catch (e) { setError(e.message) }
  }

  // ── option ops
  function patchOpt(id, patch) { setOptions(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o)) }
  async function saveOpt(opt, patch) {
    setError(''); patchOpt(opt.id, patch)
    try { await api('PATCH', { _resource: 'options', id: opt.id, ...patch }, password) }
    catch (e) { setError(e.message) }
  }
  async function addOpt(catSlug) {
    const draft = newOptByCat[catSlug] || {}
    if (!draft.slug || !draft.label) { setError('Option slug and label required'); return }
    try {
      const created = await api('POST', {
        _resource: 'options',
        category_slug: catSlug,
        slug: draft.slug,
        label: draft.label,
        sort_order: ((optionsByCat[catSlug] || []).at(-1)?.sort_order || 0) + 10,
      }, password)
      setOptions(prev => [...prev, created])
      setNewOptByCat(prev => ({ ...prev, [catSlug]: { slug: '', label: '' } }))
    } catch (e) { setError(e.message) }
  }
  async function delOpt(opt) {
    if (!confirm(`Delete option "${opt.label}"? Its vendors will also be deleted.`)) return
    try {
      await api('DELETE', { _resource: 'options', id: opt.id }, password)
      setOptions(prev => prev.filter(o => o.id !== opt.id))
      setVendors(prev => prev.filter(v => v.option_id !== opt.id))
    } catch (e) { setError(e.message) }
  }

  // ── vendor ops
  function patchVendor(id, patch) { setVendors(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v)) }
  async function saveVendor(v, patch) {
    setError(''); patchVendor(v.id, patch)
    try { await api('PATCH', { _resource: 'vendors', id: v.id, ...patch }, password) }
    catch (e) { setError(e.message) }
  }
  async function addVendor(optionId) {
    const draft = newVendorByOpt[optionId] || {}
    if (!draft.name) { setError('Vendor name required'); return }
    try {
      const created = await api('POST', {
        _resource: 'vendors',
        option_id: optionId,
        name: draft.name,
        descriptor: draft.descriptor || '',
        consent_on: draft.consent_on || null,
        sort_order: ((vendorsByOpt[optionId] || []).at(-1)?.sort_order || 0) + 10,
      }, password)
      setVendors(prev => [...prev, created])
      setNewVendorByOpt(prev => ({ ...prev, [optionId]: { name: '', descriptor: '', consent_on: '' } }))
    } catch (e) { setError(e.message) }
  }
  async function delVendor(v) {
    if (!confirm(`Remove vendor "${v.name}"?`)) return
    try {
      await api('DELETE', { _resource: 'vendors', id: v.id }, password)
      setVendors(prev => prev.filter(x => x.id !== v.id))
    } catch (e) { setError(e.message) }
  }

  return (
    <>
      {error && <p style={{ color: 'var(--rose)', fontSize: 12, marginBottom: 12 }}>{error}</p>}

      {/* Add category inline */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 14, display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'end' }}>
        <div>
          <label style={labelStyle}>Slug</label>
          <input value={newCat.slug} onChange={e => setNewCat(c => ({ ...c, slug: e.target.value }))} style={inputStyle} placeholder="lowercase-with-dashes" />
        </div>
        <div>
          <label style={labelStyle}>Name</label>
          <input value={newCat.name} onChange={e => setNewCat(c => ({ ...c, name: e.target.value }))} style={inputStyle} placeholder="Display name" />
        </div>
        <button onClick={addCat} style={btn('var(--forest)')}>+ Add category</button>
      </div>

      {categories.map(cat => {
        const opts = optionsByCat[cat.slug] || []
        const isOpenCat = openCat === cat.slug
        return (
          <div key={cat.slug} style={{ border: '1px solid var(--border)', marginBottom: 8, background: 'white' }}>
            <button
              onClick={() => setOpenCat(isOpenCat ? null : cat.slug)}
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px 14px', display: 'flex', alignItems: 'baseline', gap: 10 }}
            >
              <strong style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink)' }}>{cat.name}</strong>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>
                {cat.slug} · {opts.length} option{opts.length === 1 ? '' : 's'} · sort {cat.sort_order ?? 0}
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>{isOpenCat ? '−' : '+'}</span>
            </button>

            {isOpenCat && (
              <div style={{ padding: '0 14px 16px', borderTop: '1px solid var(--border)' }}>
                {/* Category meta editing */}
                <div style={{ paddingTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 80px auto', gap: 10, alignItems: 'end' }}>
                  <div>
                    <label style={labelStyle}>Display name</label>
                    <input value={cat.name ?? ''} onChange={e => patchCat(cat.id, { name: e.target.value })} onBlur={() => saveCat(cat, { name: cat.name })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Section description (optional)</label>
                    <input value={cat.description ?? ''} onChange={e => patchCat(cat.id, { description: e.target.value })} onBlur={() => saveCat(cat, { description: cat.description })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Sort</label>
                    <input type="number" value={cat.sort_order ?? 0}
                      onChange={e => patchCat(cat.id, { sort_order: parseInt(e.target.value, 10) || 0 })}
                      onBlur={() => saveCat(cat, { sort_order: cat.sort_order })}
                      style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => saveCat(cat, { active: !cat.active })} style={btn(cat.active ? '#e8e4de' : 'var(--forest)', cat.active ? 'var(--ink)' : 'white')}>
                      {cat.active ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => delCat(cat)} style={btn('#b84040')}>×</button>
                  </div>
                </div>

                {/* Options list */}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <p style={{ ...labelStyle, marginBottom: 12 }}>Options</p>

                  {opts.map(opt => {
                    const isOpenOpt = openOpt === opt.id
                    const optVendors = vendorsByOpt[opt.id] || []
                    const liveVendors = optVendors.filter(v => v.consent_on && v.active).length
                    return (
                      <div key={opt.id} style={{ border: '1px solid var(--border)', marginBottom: 6, background: '#fdfaf6' }}>
                        <button
                          onClick={() => setOpenOpt(isOpenOpt ? null : opt.id)}
                          style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 12px', display: 'flex', alignItems: 'baseline', gap: 10 }}
                        >
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink)' }}>{opt.label}</span>
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>
                            {opt.range_low != null && opt.range_high != null ? `$${opt.range_low.toLocaleString()}–$${opt.range_high.toLocaleString()}` : 'no range'}
                            {' · '}
                            {liveVendors} live vendor{liveVendors === 1 ? '' : 's'}
                            {optVendors.length - liveVendors > 0 && ` · ${optVendors.length - liveVendors} pending consent`}
                          </span>
                          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>{isOpenOpt ? '−' : '+'}</span>
                        </button>

                        {isOpenOpt && (
                          <div style={{ padding: '0 12px 12px', borderTop: '1px solid var(--border)' }}>
                            {/* Option meta */}
                            <div style={{ paddingTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                              <div>
                                <label style={labelStyle}>Label</label>
                                <input value={opt.label ?? ''} onChange={e => patchOpt(opt.id, { label: e.target.value })} onBlur={() => saveOpt(opt, { label: opt.label })} style={inputStyle} />
                              </div>
                              <div>
                                <label style={labelStyle}>Slug</label>
                                <input value={opt.slug ?? ''} onChange={e => patchOpt(opt.id, { slug: e.target.value })} onBlur={() => saveOpt(opt, { slug: opt.slug })} style={inputStyle} />
                              </div>
                            </div>
                            <div style={{ marginTop: 10 }}>
                              <label style={labelStyle}>Description (one line, vibe)</label>
                              <input value={opt.description ?? ''} onChange={e => patchOpt(opt.id, { description: e.target.value })} onBlur={() => saveOpt(opt, { description: opt.description })} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', gap: 10 }}>
                              <div>
                                <label style={labelStyle}>Range low ($)</label>
                                <input type="number" value={opt.range_low ?? ''}
                                  onChange={e => patchOpt(opt.id, { range_low: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
                                  onBlur={() => saveOpt(opt, { range_low: opt.range_low })}
                                  style={inputStyle} />
                              </div>
                              <div>
                                <label style={labelStyle}>Range high ($)</label>
                                <input type="number" value={opt.range_high ?? ''}
                                  onChange={e => patchOpt(opt.id, { range_high: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
                                  onBlur={() => saveOpt(opt, { range_high: opt.range_high })}
                                  style={inputStyle} />
                              </div>
                              <div>
                                <label style={labelStyle}>Range note (optional)</label>
                                <input value={opt.range_note ?? ''} onChange={e => patchOpt(opt.id, { range_note: e.target.value })} onBlur={() => saveOpt(opt, { range_note: opt.range_note })} style={inputStyle} />
                              </div>
                              <div>
                                <label style={labelStyle}>Sort</label>
                                <input type="number" value={opt.sort_order ?? 0}
                                  onChange={e => patchOpt(opt.id, { sort_order: parseInt(e.target.value, 10) || 0 })}
                                  onBlur={() => saveOpt(opt, { sort_order: opt.sort_order })}
                                  style={inputStyle} />
                              </div>
                            </div>
                            <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                              <button onClick={() => saveOpt(opt, { active: !opt.active })} style={btn(opt.active ? '#e8e4de' : 'var(--forest)', opt.active ? 'var(--ink)' : 'white')}>
                                {opt.active ? 'Hide' : 'Show'}
                              </button>
                              <button onClick={() => delOpt(opt)} style={btn('#b84040')}>Delete option</button>
                            </div>

                            {/* Vendors for this option */}
                            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                              <p style={{ ...labelStyle, marginBottom: 8 }}>Vendors who fit this option</p>
                              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', marginBottom: 10 }}>
                                Public only when both <strong>active</strong> and a <strong>consent date</strong> are set. 1 or 2 names is enough — info button reveals them.
                              </p>

                              {optVendors.map(v => (
                                <div key={v.id} style={{ borderBottom: '1px solid var(--border)', padding: '8px 0' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 130px auto', gap: 8, alignItems: 'end' }}>
                                    <div>
                                      <label style={labelStyle}>Name</label>
                                      <input value={v.name ?? ''} onChange={e => patchVendor(v.id, { name: e.target.value })} onBlur={() => saveVendor(v, { name: v.name })} style={inputStyle} />
                                    </div>
                                    <div>
                                      <label style={labelStyle}>Descriptor</label>
                                      <input value={v.descriptor ?? ''} onChange={e => patchVendor(v.id, { descriptor: e.target.value })} onBlur={() => saveVendor(v, { descriptor: v.descriptor })} style={inputStyle} />
                                    </div>
                                    <div>
                                      <label style={labelStyle}>Consent date</label>
                                      <input type="date" value={v.consent_on ?? ''}
                                        onChange={e => patchVendor(v.id, { consent_on: e.target.value || null })}
                                        onBlur={() => saveVendor(v, { consent_on: v.consent_on })}
                                        style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      <button onClick={() => saveVendor(v, { active: !v.active })} style={btn(v.active ? '#e8e4de' : 'var(--forest)', v.active ? 'var(--ink)' : 'white')}>
                                        {v.active ? 'Hide' : 'Show'}
                                      </button>
                                      <button onClick={() => delVendor(v)} style={btn('#b84040')}>×</button>
                                    </div>
                                  </div>
                                  {!v.consent_on && (
                                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--rose)', marginTop: 4 }}>
                                      Not yet shown publicly — set a consent date to publish.
                                    </p>
                                  )}
                                </div>
                              ))}

                              {/* Add vendor */}
                              <div style={{ paddingTop: 10, display: 'grid', gridTemplateColumns: '1fr 2fr 130px auto', gap: 8, alignItems: 'end' }}>
                                <input placeholder="Vendor name"
                                  value={newVendorByOpt[opt.id]?.name || ''}
                                  onChange={e => setNewVendorByOpt(p => ({ ...p, [opt.id]: { ...(p[opt.id] || {}), name: e.target.value } }))}
                                  style={inputStyle} />
                                <input placeholder="One-line descriptor"
                                  value={newVendorByOpt[opt.id]?.descriptor || ''}
                                  onChange={e => setNewVendorByOpt(p => ({ ...p, [opt.id]: { ...(p[opt.id] || {}), descriptor: e.target.value } }))}
                                  style={inputStyle} />
                                <input type="date"
                                  value={newVendorByOpt[opt.id]?.consent_on || ''}
                                  onChange={e => setNewVendorByOpt(p => ({ ...p, [opt.id]: { ...(p[opt.id] || {}), consent_on: e.target.value } }))}
                                  style={inputStyle} />
                                <button onClick={() => addVendor(opt.id)} style={btn('var(--forest)')}>+ Add</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Add option */}
                  <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 8, alignItems: 'end' }}>
                    <input placeholder="option-slug"
                      value={newOptByCat[cat.slug]?.slug || ''}
                      onChange={e => setNewOptByCat(p => ({ ...p, [cat.slug]: { ...(p[cat.slug] || {}), slug: e.target.value } }))}
                      style={inputStyle} />
                    <input placeholder="Option label (e.g. Plated dinner)"
                      value={newOptByCat[cat.slug]?.label || ''}
                      onChange={e => setNewOptByCat(p => ({ ...p, [cat.slug]: { ...(p[cat.slug] || {}), label: e.target.value } }))}
                      style={inputStyle} />
                    <button onClick={() => addOpt(cat.slug)} style={btn('var(--forest)')}>+ Add option</button>
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

// ─── Page-level total ────────────────────────────────────────────────────────
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
        Used as a fallback when no options have been chosen on <strong>/what-it-costs</strong>, and shown alongside the running estimate as the typical Rixey range. Leave blank to hide.
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

// ─── Main page ───────────────────────────────────────────────────────────────
export default function BudgetsAdminPage() {
  const { password } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [categories, setCategories] = useState([])
  const [options, setOptions]       = useState([])
  const [vendors, setVendors]       = useState([])
  const [total, setTotal]           = useState({})

  useEffect(() => {
    if (!password) return
    api('GET', null, password, '?resource=all')
      .then(data => {
        setCategories(data.categories || [])
        setOptions(data.options || [])
        setVendors(data.vendors || [])
        setTotal(data.total || {})
      })
      .catch(e => setLoadError(e.message))
      .finally(() => setLoading(false))
  }, [password])

  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>
        Budgets
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 24 }}>
        Drives the build-your-own calculator at <strong>/what-it-costs</strong>. Empty fields render cleanly on the public page (nothing is fabricated). Vendors only go live when active AND a consent date is set.
      </p>

      {loading && <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>Loading…</p>}
      {loadError && (
        <p style={{ color: 'var(--rose)', fontFamily: 'var(--font-ui)', fontSize: 13, marginBottom: 18 }}>
          Couldn't load: {loadError}. Has the latest <code>add_budget_tables_v2.sql</code> migration been run in Supabase?
        </p>
      )}

      {!loading && !loadError && (
        <>
          <Section title="Page total" hint="Optional fallback range and caveat shown on /what-it-costs.">
            <TotalEditor password={password} total={total} setTotal={setTotal} />
          </Section>

          <Section title="Categories, options, and vendors" hint={`${categories.length} categor${categories.length === 1 ? 'y' : 'ies'} · ${options.length} option${options.length === 1 ? '' : 's'} · ${vendors.filter(v => v.consent_on && v.active).length} live vendor${vendors.filter(v => v.consent_on && v.active).length === 1 ? '' : 's'}.`}>
            <CategoriesEditor
              password={password}
              categories={categories} setCategories={setCategories}
              options={options}       setOptions={setOptions}
              vendors={vendors}       setVendors={setVendors}
            />
          </Section>
        </>
      )}
    </div>
  )
}
