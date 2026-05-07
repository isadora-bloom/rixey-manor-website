import { supabaseServer } from '@/lib/supabaseServer'
import Link from 'next/link'
import FinalCTA from '@/components/home/FinalCTA'
import BudgetExplorer from '@/components/budgets/BudgetExplorer'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'What a Wedding at Rixey Actually Costs',
    description: 'An honest read on what a full wedding at Rixey costs, line by line. Pick what matters most to you and see where the money goes.',
    alternates: { canonical: 'https://www.rixeymanor.com/what-it-costs' },
    openGraph: {
      title: 'What a Wedding at Rixey Actually Costs',
      description: 'An honest read on what a full wedding here costs. Line by line. Trade-offs included.',
      url: 'https://www.rixeymanor.com/what-it-costs',
    },
  }
}

async function getBudgetData() {
  const sb = supabaseServer()

  const [catRes, priRes, mapRes, venRes, contentRes] = await Promise.all([
    sb.from('budget_categories').select('*').eq('active', true).order('sort_order'),
    sb.from('budget_priorities').select('*').eq('active', true).order('sort_order'),
    sb.from('budget_priority_categories').select('*'),
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

  // Group vendors by category for client-side reveal
  const vendorsByCategory = {}
  for (const v of venRes.data || []) {
    if (!vendorsByCategory[v.category_slug]) vendorsByCategory[v.category_slug] = []
    vendorsByCategory[v.category_slug].push({ id: v.id, name: v.name, descriptor: v.descriptor })
  }

  return {
    categories: catRes.data || [],
    priorities: priRes.data || [],
    priorityMap: mapRes.data || [],
    vendorsByCategory,
    content,
  }
}

export default async function WhatItCostsPage() {
  const { categories, priorities, priorityMap, vendorsByCategory, content } = await getBudgetData()

  const totalLow  = content.what_it_costs_total_low ? parseInt(content.what_it_costs_total_low, 10) : null
  const totalHigh = content.what_it_costs_total_high ? parseInt(content.what_it_costs_total_high, 10) : null
  const totalNote    = content.what_it_costs_total_note || ''
  const totalCaveat  = content.what_it_costs_total_caveat || ''
  const lastReviewed = content.what_it_costs_last_reviewed || ''

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
          What it costs
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(34px, 5vw, 60px)',
          color: 'var(--ink)',
          lineHeight: 1.12,
          marginBottom: 24,
        }}>
          The whole wedding,<br /><em>line by line.</em>
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'var(--ink-light)',
          maxWidth: 640,
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          Most venues end at the venue cost. This goes further.
          Pick what matters most to you, and see where the money goes,
          where couples typically push, and where they trim back.
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
        <BudgetExplorer
          categories={categories}
          priorities={priorities}
          priorityMap={priorityMap}
          vendorsByCategory={vendorsByCategory}
          totalLow={totalLow}
          totalHigh={totalHigh}
          totalNote={totalNote}
          totalCaveat={totalCaveat}
        />
      )}

      {/* Footer disclaimer */}
      <section style={{
        padding: 'clamp(40px, 5vw, 64px) clamp(20px, 5vw, 60px)',
        background: 'var(--warm-white)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p className="body-copy" style={{ marginBottom: 14 }}>
            These ranges are framework, not quote. Vendor pricing changes,
            your specific choices change the math, and your coordinator will
            build a real budget with you once you book. If you want something
            unusual (mariachi band, kosher catering, drone, mehndi setup, a
            horse), we have favorites for almost everything. Ask on your tour.
          </p>
          {lastReviewed && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-light)', marginTop: 18 }}>
              Last reviewed {lastReviewed}.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: 'clamp(60px, 7vw, 96px) clamp(20px, 5vw, 60px)',
        background: 'var(--cream)',
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
            Tours are free. Isadora gives them herself. Bring your priorities,
            bring your questions, bring the budget conversation.
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
