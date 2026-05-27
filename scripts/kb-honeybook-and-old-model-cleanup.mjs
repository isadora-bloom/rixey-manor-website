/**
 * kb-honeybook-and-old-model-cleanup.mjs
 *
 * Sweeps the live Rixey knowledge_base for two classes of stale content:
 *   1. HoneyBook references (we moved to ContractHouse — see contracthouse repo)
 *   2. OLD MODEL bartending wording stated as current (post-2026-05-03 the
 *      package model changed: bartending and the day-of venue team are included,
 *      ratio is 1:60 not 1:50, and the $350/person Venmo workflow only applies
 *      to contracts signed before that date)
 *
 * Strategy: don't blanket-delete — that loses real content. For each affected
 * row, update only the offending wording, swapping HoneyBook → ContractHouse /
 * couple portal, and adding a clear "Old model (contracts signed before 3 May
 * 2026) — billed separately at $350/person" caveat in front of legacy
 * staffing/tipping prose.
 *
 * Idempotent: re-running won't double-tag content that's already been fixed.
 *
 * Usage:
 *   node scripts/kb-honeybook-and-old-model-cleanup.mjs
 *
 * Env: hardcoded service-role key, same pattern as kb-cleanup.mjs (this is
 * a one-shot maintenance tool, not a deployed surface).
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mewwmahgokmjbcsogmvm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld3dtYWhnb2ttamJjc29nbXZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIzMDE0NCwiZXhwIjoyMDg1ODA2MTQ0fQ.rB2fOiH3j7SusaBPISWVr27frwdwkh6-JhCtTmpx48c'
)

// Marker so we know not to re-tag a row that's already been swept.
const SWEEP_MARKER = '<!-- swept:honeybook-and-old-model -->'

const OLD_MODEL_PREFACE =
  'OLD MODEL (contracts signed BEFORE 3 May 2026 only — bartending was billed separately at the time):'

const NEW_MODEL_NOTE =
  'NEW MODEL (contracts signed on or after 3 May 2026): bartending and the day-of venue team are included in the package price. Ratio is 1 bartender per 60 guests (minimum 2). The figures below apply only to OLD MODEL contracts.'

/**
 * Replace HoneyBook references with ContractHouse / couple portal wording.
 * Preserve everything else in the row.
 */
function replaceHoneyBook(text) {
  if (!text) return text
  return text
    .replace(/Honeybook/g, 'ContractHouse')
    .replace(/HoneyBook/g, 'ContractHouse')
    .replace(/honeybook/g, 'ContractHouse')
    .replace(/HB(?=\s)/g, 'ContractHouse')
}

/**
 * Detect OLD MODEL bartending claims stated as current and prepend the
 * NEW/OLD caveat. Heuristic: row mentions $350 AND (bartender OR staff)
 * AND doesn't already carry the NEW_MODEL_NOTE.
 */
function maybePrefaceStaffing(text) {
  if (!text) return text
  if (text.includes(NEW_MODEL_NOTE)) return text
  if (!/\$350/.test(text)) return text
  if (!/bartender|staff|tip jar/i.test(text)) return text
  return `${NEW_MODEL_NOTE}\n\n${OLD_MODEL_PREFACE}\n\n${text}`
}

async function main() {
  console.log('Fetching knowledge_base...')
  const { data: rows, error } = await supabase.from('knowledge_base').select('*')
  if (error) {
    console.error('Fetch error:', error.message)
    process.exit(1)
  }
  console.log(`  Total rows: ${rows.length}`)

  const updates = []

  for (const row of rows) {
    // Skip rows already swept in a prior run.
    if ((row.content || '').includes(SWEEP_MARKER)) continue

    const haystack = [row.title, row.description, row.content].join(' ')
    const hasHoneyBook = /honeybook/i.test(haystack)
    const hasOldModel =
      /\$350/.test(haystack) && /bartender|staff|tip jar/i.test(haystack)

    if (!hasHoneyBook && !hasOldModel) continue

    const patch = {}
    if (hasHoneyBook) {
      const newTitle = replaceHoneyBook(row.title)
      const newDesc = replaceHoneyBook(row.description)
      const newContent = replaceHoneyBook(row.content)
      if (newTitle !== row.title) patch.title = newTitle
      if (newDesc !== row.description) patch.description = newDesc
      if (newContent !== row.content) patch.content = newContent
    }
    if (hasOldModel) {
      const base = patch.content ?? row.content
      const prefaced = maybePrefaceStaffing(base)
      if (prefaced !== base) patch.content = prefaced
    }

    // Tag so future sweeps skip this row.
    if (Object.keys(patch).length > 0) {
      patch.content = `${patch.content ?? row.content}\n\n${SWEEP_MARKER}`
      patch.updated_at = new Date().toISOString()
      updates.push({
        id: row.id,
        title: row.title,
        reasons: [hasHoneyBook && 'honeybook', hasOldModel && 'old-model']
          .filter(Boolean)
          .join(' + '),
        patch,
      })
    }
  }

  console.log(`  Rows to update: ${updates.length}\n`)

  for (const u of updates) {
    const { error: upErr } = await supabase
      .from('knowledge_base')
      .update(u.patch)
      .eq('id', u.id)
    if (upErr) {
      console.error(`  ✗ ${u.title}: ${upErr.message}`)
    } else {
      console.log(`  ✓ ${u.title}  [${u.reasons}]`)
    }
  }

  console.log(`\nDone. Swept ${updates.length} row(s).`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
