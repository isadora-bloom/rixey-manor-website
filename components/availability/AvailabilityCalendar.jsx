'use client'

import { useMemo } from 'react'
import CalendlyPopupButton from '@/components/ui/CalendlyPopupButton'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function todayStr() {
  const t = new Date()
  return toDateStr(t.getFullYear(), t.getMonth(), t.getDate())
}

function getStatus(dateStr, today, bookedRanges) {
  if (dateStr < today) return 'past'
  for (const r of bookedRanges) {
    if (dateStr >= r.start_date && dateStr <= r.end_date) return 'booked'
  }
  return 'available'
}

function MonthGrid({ year, month, bookedRanges, today }) {
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      {/* Month heading */}
      <p
        className="text-[16px] text-[var(--ink)] mb-3 pb-2 border-b border-[var(--border)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {MONTH_NAMES[month]} {year}
      </p>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map(l => (
          <div
            key={l}
            className="text-center text-[9px] tracking-[0.12em] uppercase text-[var(--ink-light)] py-1"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {l}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="aspect-square" />

          const dateStr = toDateStr(year, month, day)
          const status = getStatus(dateStr, today, bookedRanges)
          const dow = new Date(year, month, day).getDay()
          const isSun = dow === 0
          const isBooked = status === 'booked'
          const isPast = status === 'past'
          const isToday = dateStr === today

          return (
            <div
              key={day}
              className={`
                aspect-square flex flex-col items-center justify-center relative
                ${isPast ? 'opacity-20' : ''}
                ${isBooked ? 'bg-[var(--cream)]' : ''}
              `}
            >
              <span
                className={`
                  text-[11px] leading-none
                  ${isPast ? 'text-[var(--ink-light)]' : ''}
                  ${isBooked ? 'text-[var(--ink-light)]' : 'text-[var(--ink)]'}
                  ${isToday ? 'font-bold underline decoration-dotted underline-offset-2' : ''}
                `}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {day}
              </span>
              {isBooked && isSun && (
                <span
                  className="text-[7px] tracking-[0.08em] uppercase text-[var(--rose)] mt-0.5"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Booked
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AvailabilityCalendar({ bookedDates = [], calendlyUrl = '' }) {
  const today = todayStr()

  const months = useMemo(() => {
    const result = []
    const now = new Date()
    for (let i = 0; i < 24; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
      result.push({ year: d.getFullYear(), month: d.getMonth() })
    }
    return result
  }, [])

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-6 mb-10 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--cream)] border border-[var(--border)]" />
          <span className="text-[11px] tracking-[0.12em] uppercase text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>
            Booked
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-[var(--border)] opacity-30" />
          <span className="text-[11px] tracking-[0.12em] uppercase text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>
            Past
          </span>
        </div>
      </div>

      {/* 24-month grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
        {months.map(({ year, month }) => (
          <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            bookedRanges={bookedDates}
            today={today}
          />
        ))}
      </div>

      {/* CTA below calendar */}
      <div className="mt-16 pt-10 border-t border-[var(--border)]">
        <p className="body-copy mb-6 max-w-lg">
          See a date that works? Any day on the calendar is available to book.
          The next step is a tour — about an hour, we walk everything together
          and answer every question.
        </p>
        <CalendlyPopupButton url={calendlyUrl} className="btn-primary">
          Book a tour
        </CalendlyPopupButton>
      </div>
    </div>
  )
}
