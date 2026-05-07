import { supabaseServer } from '@/lib/supabaseServer'
import Link from 'next/link'
import FinalCTA from '@/components/home/FinalCTA'
import BudgetCalculator from '@/components/budgets/BudgetCalculator'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'What a Wedding at Rixey Actually Costs',
    description: 'Build the wedding you actually want, line by line. Pick the catering style, the photography level, the music, and see the running estimate. Vendor recommendations match each choice.',
    alternates: { canonical: 'https://www.rixeymanor.com/what-it-costs' },
    openGraph: {
      title: 'What a Wedding at Rixey Actually Costs',
      description: 'Build your wedding line by line. Honest ranges. Vendor recommendations matched to each choice.',
      url: 'https://www.rixeymanor.com/what-it-costs',
    },
  }
}

async function getBudgetData() {
  const sb = supabaseServer()

  const [catRes, optRes, venRes, contentRes] = await Promise.all([
    sb.from('budget_categories').select('*').eq('active', true).order('sort_order'),
    sb.from('budget_options').select('*').eq('active', true).order('sort_order'),
    sb.from('budget_vendors').select('*').eq('active', true).not('consent_on', 'is', null).order('sort_order'),
    sb.from('site_content').select('key, value').in('key', [
      'what_it_costs_total_low',
      'what_it_costs_total_high',
      'what_it_costs_total_note',
      'what_it_costs_total_caveat',
      'what_it_costs_last_reviewed',
      'calendly_url',
    ]),
  ])

  const content = (contentRes.data || []).reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})

  const optionsByCategory = {}
  for (const o of optRes.data || []) {
    if (!optionsByCategory[o.category_slug]) optionsByCategory[o.category_slug] = []
    optionsByCategory[o.category_slug].push(o)
  }

  const vendorsByOption = {}
  for (const v of venRes.data || []) {
    if (!vendorsByOption[v.option_id]) vendorsByOption[v.option_id] = []
    vendorsByOption[v.option_id].push({ id: v.id, name: v.name, descriptor: v.descriptor })
  }

  return {
    categories: catRes.data || [],
    optionsByCategory,
    vendorsByOption,
    content,
  }
}

export default async function WhatItCostsPage() {
  const { categories, optionsByCategory, vendorsByOption, content } = await getBudgetData()

  const fallbackTotalLow  = content.what_it_costs_total_low ? parseInt(content.what_it_costs_total_low, 10) : null
  const fallbackTotalHigh = content.what_it_costs_total_high ? parseInt(content.what_it_costs_total_high, 10) : null
  const fallbackTotalNote   = content.what_it_costs_total_note || ''
  const fallbackTotalCaveat = content.what_it_costs_total_caveat || ''
  const lastReviewed        = content.what_it_costs_last_reviewed || ''

  const isEmpty = categories.length === 0

  return (
    <>
      {/* Hero */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px) clamp(40px, 5vw, 64px)',
        textAlign: 'center',
        background: 'var(--warm-white)',
        borderBottom: '1px solid var(--border)',
      }}>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--ink-light)',
          marginBottom: 20,
        }}>
          How we price weddings
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(34px, 5vw, 60px)',
          color: 'var(--ink)',
          lineHeight: 1.12,
          marginBottom: 24,
        }}>
          The whole wedding,<br /><em>plainly priced.</em>
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'var(--ink-light)',
          maxWidth: 660,
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          We don't bundle. We don't mark up. The ranges below come from real Rixey weddings,
          and the vendors are people we trust. Most couples never see this layer of a venue's
          numbers. We think you should. Build the wedding below, line by line.
        </p>
      </section>

      {isEmpty ? (
        <section style={{
          padding: 'clamp(60px, 7vw, 96px) clamp(20px, 5vw, 60px)',
          background: 'var(--cream)',
          borderBottom: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <p className="body-copy">
              We're filling this in with real numbers from real Rixey weddings,
              and real vendors who have agreed to be listed. Check back soon.
            </p>
          </div>
        </section>
      ) : (
        <BudgetCalculator
          categories={categories}
          optionsByCategory={optionsByCategory}
          vendorsByOption={vendorsByOption}
          fallbackTotalLow={fallbackTotalLow}
          fallbackTotalHigh={fallbackTotalHigh}
          fallbackTotalNote={fallbackTotalNote}
          fallbackTotalCaveat={fallbackTotalCaveat}
        />
      )}

      {lastReviewed && (
        <section style={{
          padding: '24px clamp(20px, 5vw, 60px)',
          background: 'var(--warm-white)',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-light)', margin: 0 }}>
            Last reviewed {lastReviewed}.
          </p>
        </section>
      )}

      {/* Closing CTA */}
      <section style={{
        padding: 'clamp(60px, 7vw, 96px) clamp(20px, 5vw, 60px)',
        background: 'var(--cream)',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 3.4vw, 36px)',
            color: 'var(--ink)',
            lineHeight: 1.22,
            marginBottom: 18,
            fontStyle: 'italic',
          }}>
            Ready to make this real?
          </h2>
          <p className="body-copy" style={{ marginBottom: 28 }}>
            Tours are free. Isadora gives them herself. Bring the questions you'd ask a venue you actually trust.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/pricing#book-tour" className="btn-primary">
              Book a tour
            </Link>
            <Link href="/pricing" className="btn-rose">
              See the venue calculator
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA calendlyUrl={content.calendly_url} />
    </>
  )
}
