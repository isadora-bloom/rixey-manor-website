'use client'

import { useState } from 'react'

const CATEGORY_LABELS = {
  general:         'The Basics',
  pricing:         'Pricing',
  logistics:       'Getting There & Logistics',
  accommodations:  'Accommodations',
  food_drink:      'Food & Drink',
  vendors:         'Vendors',
  elopements:      'Elopements',
  accessibility:   'Accessibility',
}

const CATEGORY_ORDER = ['general', 'pricing', 'logistics', 'accommodations', 'food_drink', 'vendors', 'elopements', 'accessibility']

function AccordionItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-6 py-5 text-left focus-visible:outline-[var(--forest)]"
        aria-expanded={isOpen}
      >
        <span
          className="text-[16px] lg:text-[17px] leading-snug text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {faq.question}
        </span>
        <span
          className={`flex-shrink-0 mt-1 text-[var(--forest)] transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
          aria-hidden="true"
          style={{ fontSize: '20px', lineHeight: 1 }}
        >
          +
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] pb-5' : 'max-h-0'}`}
      >
        <p
          className="text-[15px] lg:text-[16px] leading-[1.8] text-[var(--ink-mid)] max-w-2xl"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {faq.answer}
        </p>
      </div>
    </div>
  )
}

export default function FaqAccordion({ faqs }) {
  const [openIds, setOpenIds] = useState(new Set())
  const [activeCategory, setActiveCategory] = useState('all')

  function toggle(id) {
    setOpenIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Group by category
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = faqs.filter(f => f.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  const categories = Object.keys(grouped)
  const filtered = activeCategory === 'all'
    ? grouped
    : { [activeCategory]: grouped[activeCategory] || [] }

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 text-[11px] font-medium tracking-[0.15em] uppercase transition-all border ${
            activeCategory === 'all'
              ? 'bg-[var(--forest)] text-white border-[var(--forest)]'
              : 'border-[var(--border)] text-[var(--ink-mid)] hover:border-[var(--sage)]'
          }`}
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-[11px] font-medium tracking-[0.15em] uppercase transition-all border ${
              activeCategory === cat
                ? 'bg-[var(--forest)] text-white border-[var(--forest)]'
                : 'border-[var(--border)] text-[var(--ink-mid)] hover:border-[var(--sage)]'
            }`}
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Accordions grouped by category */}
      <div className="flex flex-col gap-14">
        {Object.entries(filtered).map(([cat, items]) => (
          <div key={cat}>
            <h2
              className="text-[13px] font-medium tracking-[0.2em] uppercase text-[var(--rose)] mb-1"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {CATEGORY_LABELS[cat] || cat}
            </h2>
            <div className="border-t border-[var(--border)]">
              {items.map(faq => (
                <AccordionItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openIds.has(faq.id)}
                  onToggle={() => toggle(faq.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
