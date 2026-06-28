import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req) {
  const data = await req.json()

  const {
    season, guests, nights, upgrades, discounts5, discounts10,
    estimate, tax, perPayment,
    bartenders, bartenderRate, bartenderCost,
    nextSteps, nextStepKeys, weddingDate,
    p1Name, p1Email, p1Phone,
    p2Name, p2Email, p2Phone,
    notes,
    heardAbout,
    source, medium, campaign, referrer,
    visitor_id,
    // Structured fields for the ContractHouse handoff + richer emails
    packageKey, seasonKey, packageLabel, seasonLabel,
    subtotalPreTax, addons, breakdown,
  } = data

  // Package timing surfaced in both emails so the couple sees their hours up
  // front and the venue inbox sees what they're committing to at a glance.
  const PACKAGE_TIMES = {
    'estate-weekend': 'Friday 3pm to Sunday 10am (1pm with brunch upgrade)',
    'wedding-day':    'Saturday, 8am to 10pm',
    'midweek':        'Tuesday or Wednesday, 8am to 9pm',
  }
  const packageTiming = PACKAGE_TIMES[packageKey] || ''

  // Translate the boxes the couple ticked into a "what happens next" line so
  // the email tells them what to expect instead of echoing a checklist.
  const NEXT_STEP_MESSAGES = {
    'more-info': "We'll be in touch within 1–2 business days with more information about Rixey and your date.",
    'contract':  'A draft contract is being prepared for you and will arrive in your inbox shortly.',
    'pre-tour':  "We'll be in touch before your tour to learn a little more about your wedding.",
    'planning':  "We'll include information about our full planning services in our reply.",
  }
  const nextStepLines = Array.isArray(nextStepKeys)
    ? nextStepKeys.map(k => NEXT_STEP_MESSAGES[k]).filter(Boolean)
    : []

  // Friendly date formatter for the wedding-date field. Falls back to the raw
  // YYYY-MM-DD if the input is anything else.
  const fmtDate = (s) => {
    if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return s || ''
    const [y, m, d] = s.split('-').map(Number)
    const dt = new Date(Date.UTC(y, m - 1, d))
    return dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
  }
  const money = (n) => '$' + (Number(n) || 0).toLocaleString()

  // 1. Save to Supabase
  const submissionRow = {
    season, guests, nights,
    upgrades: upgrades?.join(', ') || '',
    discounts: [...(discounts5 || []), ...(discounts10 || [])].join(', '),
    estimate,
    tax: tax || null,
    per_payment: perPayment,
    next_steps: nextSteps?.join(', ') || '',
    next_step_keys: Array.isArray(nextStepKeys) ? nextStepKeys.join(', ') : null,
    wedding_date: weddingDate || null,
    p1_name: p1Name,
    p1_email: p1Email,
    p1_phone: p1Phone || null,
    p2_name: p2Name || null,
    p2_email: p2Email || null,
    p2_phone: p2Phone || null,
    notes: notes || null,
    heard_about: heardAbout || null,
    source: source || null, medium: medium || null, campaign: campaign || null, referrer: referrer || null,
    visitor_id: visitor_id || null,
    package_key:   packageKey   || null,
    package_label: packageLabel || null,
    season_key:    seasonKey    || null,
    season_label:  seasonLabel  || null,
    subtotal_pre_tax: typeof subtotalPreTax === 'number' ? subtotalPreTax : null,
    breakdown: breakdown || null,
    addons:    addons    || null,
  }

  let { error: dbError } = await supabase.from('calculator_submissions').insert(submissionRow)

  // Defensive: if a column in submissionRow doesn't exist yet (migration not
  // applied), Postgres returns an error naming the column. Strip it and retry
  // once so a missing migration never silently drops the whole submission.
  // All stripped data still rides along in the venue email (which Bloom ingests).
  if (dbError) {
    const unknownCol = (dbError.message || '').match(/column "([^"]+)" of relation/)?.[1]
    if (unknownCol && unknownCol in submissionRow) {
      console.warn(`[calculator-submit] column "${unknownCol}" missing — retrying without it. Apply add_calculator_missing_columns.sql.`)
      const trimmed = { ...submissionRow }
      delete trimmed[unknownCol]
      ;({ error: dbError } = await supabase.from('calculator_submissions').insert(trimmed))
    }
  }

  if (dbError) {
    console.error('DB error:', dbError.message)
    // Don't fail the whole request — try to send email anyway
  }

  // 1b. Backfill identity onto the visitor row so this person is now identified
  // for any prior anonymous pageviews. Best-effort; never blocks the response.
  if (visitor_id && p1Email) {
    try {
      const { data: existing } = await supabase
        .from('site_visitors')
        .select('visitor_id, first_name, partner_name, email, phone, identified_at')
        .eq('visitor_id', visitor_id)
        .maybeSingle()

      const update = {}
      if (p1Name && !existing?.first_name)   update.first_name   = p1Name
      if (p2Name && !existing?.partner_name) update.partner_name = p2Name
      if (p1Email && !existing?.email)       update.email        = p1Email.toLowerCase()
      if (p1Phone && !existing?.phone)       update.phone        = p1Phone
      if (!existing?.identified_at && (update.first_name || update.email)) {
        update.identified_at = new Date().toISOString()
      }
      if (existing && Object.keys(update).length) {
        await supabase.from('site_visitors').update(update).eq('visitor_id', visitor_id)
      } else if (!existing) {
        await supabase.from('site_visitors').insert({
          visitor_id,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
          first_name: p1Name || null,
          partner_name: p2Name || null,
          email: p1Email.toLowerCase(),
          phone: p1Phone || null,
          identified_at: new Date().toISOString(),
        })
      }
    } catch (e) {
      console.error('[calculator-submit] visitor backfill error:', e?.message || e)
    }
  }

  // 2. Send emails if Resend is configured
  if (resend) {
    const wantsContract = nextSteps?.some(s => /contract/i.test(s))

    // Itemized breakdown rows. Each row is rendered only if it has a non-zero
    // amount. The discount row sits between subtotal and tax, mirroring the
    // sticky price panel inside the calculator.
    const breakdownRows = breakdown ? [
      ['Package base',                                                    money(breakdown.base)],
      breakdown.satMod       ? ['Saturday guests',                        '+' + money(breakdown.satMod)]                        : null,
      breakdown.friMod       ? ['Friday guests',                          '+' + money(breakdown.friMod)]                        : null,
      breakdown.upgradeAmt   ? ['Upgrades',                               '+' + money(breakdown.upgradeAmt)]                    : null,
      breakdown.hoursAmt     ? [`Extra hour${breakdown.extraHours > 1 ? `s × ${breakdown.extraHours}` : ''} (after 10pm)`, '+' + money(breakdown.hoursAmt)] : null,
      breakdown.extraEventAmt ? (() => {
        const labels = breakdown.extraEventLabels
        const label = labels?.length
          ? `Extra event${labels.length > 1 ? 's' : ''}: ${labels.join(', ')}`
          : `Extra event${breakdown.extraEventLabel ? ` (${breakdown.extraEventLabel.toLowerCase()})` : 's'}`
        return [label, '+' + money(breakdown.extraEventAmt)]
      })() : null,
      ['__subtotal__',                                                    money(breakdown.subtotal)],
      breakdown.discountAmt  ? [`Discount (${breakdown.discountPct}%)`,   '−' + money(breakdown.discountAmt)]                   : null,
      ['Sales tax (6%)',                                                  '+' + money(breakdown.tax)],
    ].filter(Boolean) : []

    const coupleHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1814;">
        <h2 style="font-size: 28px; font-weight: normal; margin-bottom: 8px;">Your Rixey Manor estimate</h2>
        <p style="color: #7A6E68; font-size: 15px; margin-bottom: 24px;">A copy of what you put together. Here's what's next.</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          ${[
            ['Package & season', season],
            packageTiming ? ['Timing', packageTiming] : null,
            ['Guests', guests],
            nights ? ['Overnight stays', nights] : null,
            upgrades?.length ? ['Upgrades', upgrades.join(', ')] : null,
            discounts5?.length ? ['5% discounts', discounts5.join(', ')] : null,
            discounts10?.length ? ['10% discounts', discounts10.join(', ')] : null,
          ].filter(Boolean).map(([label, value]) => `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E0D8D0; color: #7A6E68; font-size: 13px; width: 40%;">${label}</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E0D8D0; font-size: 14px;">${value}</td>
            </tr>
          `).join('')}
        </table>

        <div style="background: #F7F3EE; padding: 24px; margin-bottom: 24px;">
          <p style="font-size: 36px; color: #2E7D54; margin: 0 0 4px; font-weight: normal;">$${estimate?.toLocaleString()}</p>
          <p style="font-size: 13px; color: #7A6E68; margin: 0 0 16px;">Estimated total (includes 6% Virginia sales tax${tax ? ` of $${tax.toLocaleString()}` : ''})</p>
          <p style="font-size: 18px; color: #1C1814; margin: 0 0 4px;">$${perPayment?.toLocaleString()} × 3 payments</p>
          <p style="font-size: 12px; color: #7A6E68; margin: 0;">Retainer to reserve the date · halfway through planning · 3 months before the wedding.</p>
        </div>

        ${breakdownRows.length ? `
        <div style="border: 1px solid #E0D8D0; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #2E7D54; margin: 0 0 12px;">How that total is built</p>
          <table style="width: 100%; border-collapse: collapse;">
            ${breakdownRows.map(([label, value]) => label === '__subtotal__' ? `
              <tr>
                <td style="padding: 10px 0 6px; border-top: 1px solid #E0D8D0; font-size: 13px; color: #7A6E68;">Subtotal</td>
                <td style="padding: 10px 0 6px; border-top: 1px solid #E0D8D0; font-size: 13px; color: #7A6E68; text-align: right;">${value}</td>
              </tr>
            ` : `
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #3D3530;">${label}</td>
                <td style="padding: 6px 0; font-size: 13px; color: #3D3530; text-align: right;">${value}</td>
              </tr>
            `).join('')}
            <tr>
              <td style="padding: 10px 0 0; border-top: 1px solid #1C1814; font-size: 14px; color: #1C1814;"><strong>Total</strong></td>
              <td style="padding: 10px 0 0; border-top: 1px solid #1C1814; font-size: 14px; color: #2E7D54; text-align: right;"><strong>${money(breakdown.total)}</strong></td>
            </tr>
          </table>
        </div>
        ` : ''}

        <div style="border: 1px solid #E0D8D0; padding: 20px; margin-bottom: 16px;">
          <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #2E7D54; margin: 0 0 8px;">What's in the price above</p>
          <p style="font-size: 14px; color: #3D3530; margin: 0; line-height: 1.6;">
            Licensed bartending, table linens, the silk floral and candle package, day-of venue team, on-site coordinator, Chiavari chairs and tables, and the borrow shed — all included. BYOB with no corkage. No required vendor list. No vendor markup.
          </p>
        </div>

        <div style="border: 1px solid #E0D8D0; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #B8908A; margin: 0 0 8px;">What you'll bring on your own</p>
          <p style="font-size: 14px; color: #3D3530; margin: 0; line-height: 1.6;">
            Catering, alcohol (BYOB, no corkage), photography, flowers, music, hair &amp; makeup, and any cake or sweets. Your coordinator helps you build that team — and using only our recommended vendors earns a 5% discount on the venue.
          </p>
        </div>

        ${nextStepLines.length ? `
        <div style="background: #FBF7F1; border-left: 3px solid #2E7D54; padding: 18px 20px; margin-bottom: 24px;">
          <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #2E7D54; margin: 0 0 10px;">What happens next</p>
          ${nextStepLines.map(line => `<p style="font-size: 14px; color: #3D3530; margin: 0 0 6px; line-height: 1.5;">• ${line}</p>`).join('')}
          <p style="font-size: 13px; color: #7A6E68; margin: 12px 0 0;">Or skip the wait — reply to this email or call <a href="tel:+15402124545" style="color: #2E7D54;">(540) 212-4545</a>.</p>
        </div>
        ` : `
        <div style="background: #FBF7F1; border-left: 3px solid #2E7D54; padding: 18px 20px; margin-bottom: 24px;">
          <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #2E7D54; margin: 0 0 10px;">What happens next</p>
          <p style="font-size: 14px; color: #3D3530; margin: 0; line-height: 1.5;">We'll be in touch within 1–2 business days. To skip the wait, reply to this email or call <a href="tel:+15402124545" style="color: #2E7D54;">(540) 212-4545</a>.</p>
        </div>
        `}

        ${weddingDate ? `<p style="font-size: 14px; margin-bottom: 8px;"><strong>Date in mind:</strong> ${fmtDate(weddingDate)}</p>` : ''}
        ${p1Phone ? `<p style="font-size: 14px; margin-bottom: 8px;"><strong>Phone on file:</strong> ${p1Phone}</p>` : ''}
        ${notes ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Your note to us:</strong> ${notes}</p>` : ''}

        <hr style="border: none; border-top: 1px solid #E0D8D0; margin: 24px 0;" />
        <p style="font-size: 13px; color: #7A6E68;">
          This is an estimate. Final pricing is confirmed at your tour.<br>
          Rixey Manor · 9155 Pleasant Hill Lane, Rixeyville, VA 22737 · <a href="tel:+15402124545" style="color: #7A6E68;">(540) 212-4545</a>
        </p>
      </div>
    `

    const utmBits = [
      source && `source: ${source}`,
      medium && `medium: ${medium}`,
      campaign && `campaign: ${campaign}`,
      referrer && `referrer: ${referrer}`,
    ].filter(Boolean).join(' · ')

    // Tel-link helper: strip everything but digits + leading +.
    const telHref = (p) => p ? `tel:${String(p).replace(/[^0-9+]/g, '')}` : null

    const venueHtml = `
      <div style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; color: #1C1814;">
        <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 4px;">New calculator submission${wantsContract ? ' — contract requested' : ''}</h2>
        <p style="color: #7A6E68; font-size: 13px; margin-bottom: 20px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <!-- Couple block -->
        <div style="background: #FBF7F1; border: 1px solid #E0D8D0; padding: 18px 20px; margin-bottom: 20px;">
          <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #7A6E68; margin: 0 0 10px;">The couple</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #7A6E68; width: 130px;">Partner 1</td>
              <td style="padding: 4px 0; color: #1C1814;"><strong>${p1Name || '—'}</strong></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #7A6E68;">Email</td>
              <td style="padding: 4px 0;"><a href="mailto:${p1Email}" style="color: #2E7D54;">${p1Email}</a></td>
            </tr>
            ${p1Phone ? `
            <tr>
              <td style="padding: 4px 0; color: #7A6E68;">Phone</td>
              <td style="padding: 4px 0;"><a href="${telHref(p1Phone)}" style="color: #2E7D54;">${p1Phone}</a></td>
            </tr>` : ''}
            ${p2Name ? `
            <tr>
              <td style="padding: 4px 0; color: #7A6E68; padding-top: 10px;">Partner 2</td>
              <td style="padding: 4px 0; color: #1C1814; padding-top: 10px;"><strong>${p2Name}</strong></td>
            </tr>` : ''}
            ${p2Email ? `
            <tr>
              <td style="padding: 4px 0; color: #7A6E68;">Email</td>
              <td style="padding: 4px 0;"><a href="mailto:${p2Email}" style="color: #2E7D54;">${p2Email}</a></td>
            </tr>` : ''}
            ${p2Phone ? `
            <tr>
              <td style="padding: 4px 0; color: #7A6E68;">Phone</td>
              <td style="padding: 4px 0;"><a href="${telHref(p2Phone)}" style="color: #2E7D54;">${p2Phone}</a></td>
            </tr>` : ''}
          </table>
        </div>

        <!-- Booking details + full contract breakdown -->
        <div style="border: 1px solid #E0D8D0; padding: 18px 20px; margin-bottom: 20px;">
          <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #7A6E68; margin: 0 0 12px;">Booking details</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            ${weddingDate ? `
            <tr>
              <td style="padding: 5px 0; color: #7A6E68; width: 150px;">Date in mind</td>
              <td style="padding: 5px 0; color: #1C1814;"><strong>${fmtDate(weddingDate)}</strong></td>
            </tr>` : ''}
            <tr>
              <td style="padding: 5px 0; color: #7A6E68;">Package</td>
              <td style="padding: 5px 0; color: #1C1814;">${packageLabel || season || ''}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #7A6E68;">Season</td>
              <td style="padding: 5px 0; color: #1C1814;">${seasonLabel || ''}</td>
            </tr>
            ${packageTiming ? `
            <tr>
              <td style="padding: 5px 0; color: #7A6E68;">Timing</td>
              <td style="padding: 5px 0; color: #1C1814;">${packageTiming}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 5px 0; color: #7A6E68;">Guests</td>
              <td style="padding: 5px 0; color: #1C1814;">${guests || ''}</td>
            </tr>
            ${heardAbout ? `
            <tr>
              <td style="padding: 5px 0; color: #7A6E68;">How found us</td>
              <td style="padding: 5px 0; color: #1C1814;">${heardAbout}</td>
            </tr>` : ''}
          </table>

          ${breakdown ? `
          <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #B8908A; margin: 0 0 12px; border-top: 1px solid #E0D8D0; padding-top: 16px;">Contract entry order</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <!-- Package base -->
            <tr>
              <td style="padding: 6px 0; color: #3D3530; border-bottom: 1px solid #F0EAE3;">${packageLabel || ''}${seasonLabel ? ` · ${seasonLabel}` : ''}</td>
              <td style="padding: 6px 0; color: #1C1814; text-align: right; border-bottom: 1px solid #F0EAE3;">${money(breakdown.base)}</td>
            </tr>
            <!-- Saturday guest modifier -->
            ${breakdown.satMod > 0 ? `
            <tr>
              <td style="padding: 6px 0; color: #3D3530; border-bottom: 1px solid #F0EAE3;">Saturday guests</td>
              <td style="padding: 6px 0; color: #1C1814; text-align: right; border-bottom: 1px solid #F0EAE3;">+${money(breakdown.satMod)}</td>
            </tr>` : ''}
            <!-- Friday guest modifier -->
            ${breakdown.friMod > 0 ? `
            <tr>
              <td style="padding: 6px 0; color: #3D3530; border-bottom: 1px solid #F0EAE3;">Friday guests</td>
              <td style="padding: 6px 0; color: #1C1814; text-align: right; border-bottom: 1px solid #F0EAE3;">+${money(breakdown.friMod)}</td>
            </tr>` : ''}
            <!-- Upgrades — each item individually if detail available, else combined -->
            ${Array.isArray(breakdown.upgradesDetail) && breakdown.upgradesDetail.length > 0
              ? breakdown.upgradesDetail.map(u => `
            <tr>
              <td style="padding: 6px 0; color: #3D3530; border-bottom: 1px solid #F0EAE3;">${u.label}</td>
              <td style="padding: 6px 0; color: #1C1814; text-align: right; border-bottom: 1px solid #F0EAE3;">+${money(u.price)}</td>
            </tr>`).join('')
              : [
                  breakdown.upgradeAmt > 0 ? `<tr><td style="padding: 6px 0; color: #3D3530; border-bottom: 1px solid #F0EAE3;">Upgrades</td><td style="padding: 6px 0; color: #1C1814; text-align: right; border-bottom: 1px solid #F0EAE3;">+${money(breakdown.upgradeAmt)}</td></tr>` : '',
                  breakdown.hoursAmt > 0   ? `<tr><td style="padding: 6px 0; color: #3D3530; border-bottom: 1px solid #F0EAE3;">Extra hour${breakdown.extraHours > 1 ? `s × ${breakdown.extraHours}` : ''} after 10pm</td><td style="padding: 6px 0; color: #1C1814; text-align: right; border-bottom: 1px solid #F0EAE3;">+${money(breakdown.hoursAmt)}</td></tr>` : '',
                  breakdown.extraEventAmt > 0 ? `<tr><td style="padding: 6px 0; color: #3D3530; border-bottom: 1px solid #F0EAE3;">Extra event(s)</td><td style="padding: 6px 0; color: #1C1814; text-align: right; border-bottom: 1px solid #F0EAE3;">+${money(breakdown.extraEventAmt)}</td></tr>` : '',
                ].join('')}
            <!-- Subtotal — this is what goes into the contract as the package total -->
            <tr style="background: #F0EDE8;">
              <td style="padding: 9px 8px; color: #7A6E68; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; border-top: 2px solid #C8BDB5; border-bottom: 2px solid #C8BDB5;">Subtotal — enter as package total in contract</td>
              <td style="padding: 9px 8px; color: #1C1814; font-size: 15px; font-weight: bold; text-align: right; border-top: 2px solid #C8BDB5; border-bottom: 2px solid #C8BDB5;">${money(breakdown.subtotal)}</td>
            </tr>
            <!-- Discounts — each % listed, then total applied -->
            ${Array.isArray(breakdown.discountsDetail) && breakdown.discountsDetail.length > 0 ? `
            ${breakdown.discountsDetail.map(d => `
            <tr>
              <td style="padding: 6px 0; color: #7A6E68; border-bottom: 1px solid #F0EAE3;">${d.label}</td>
              <td style="padding: 6px 0; color: #7A6E68; text-align: right; border-bottom: 1px solid #F0EAE3;">−${d.percent}%</td>
            </tr>`).join('')}
            ${breakdown.discountCapApplied ? `
            <tr>
              <td style="padding: 4px 8px; color: #B8908A; font-size: 12px; font-style: italic; border-bottom: 1px solid #F0EAE3;" colspan="2">20% cap applied — total discount is ${breakdown.discountPct}%</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 6px 0; color: #7A6E68; border-bottom: 1px solid #E0D8D0;">Total discount (${breakdown.discountPct}%)</td>
              <td style="padding: 6px 0; color: #7A6E68; text-align: right; border-bottom: 1px solid #E0D8D0;">−${money(breakdown.discountAmt)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #3D3530; border-bottom: 1px solid #E0D8D0;">After discounts</td>
              <td style="padding: 6px 0; color: #1C1814; text-align: right; border-bottom: 1px solid #E0D8D0;">${money(breakdown.subAfterDiscount)}</td>
            </tr>` : breakdown.discountAmt > 0 ? `
            <tr>
              <td style="padding: 6px 0; color: #7A6E68; border-bottom: 1px solid #E0D8D0;">Discount (${breakdown.discountPct}%)</td>
              <td style="padding: 6px 0; color: #7A6E68; text-align: right; border-bottom: 1px solid #E0D8D0;">−${money(breakdown.discountAmt)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #3D3530; border-bottom: 1px solid #E0D8D0;">After discounts</td>
              <td style="padding: 6px 0; color: #1C1814; text-align: right; border-bottom: 1px solid #E0D8D0;">${money(breakdown.subAfterDiscount)}</td>
            </tr>` : ''}
            <!-- Tax — auto-applied in contract system -->
            <tr>
              <td style="padding: 6px 0; color: #7A6E68; border-bottom: 1px solid #F0EAE3; font-size: 13px;">Sales tax 6% <em style="color: #B8908A;">(auto-applied in contract)</em></td>
              <td style="padding: 6px 0; color: #7A6E68; text-align: right; border-bottom: 1px solid #F0EAE3; font-size: 13px;">+${money(breakdown.tax)}</td>
            </tr>
            <!-- Total -->
            <tr>
              <td style="padding: 10px 0 5px; color: #1C1814; font-size: 16px; border-top: 2px solid #1C1814;"><strong>Total</strong></td>
              <td style="padding: 10px 0 5px; color: #2E7D54; font-size: 18px; text-align: right; border-top: 2px solid #1C1814;"><strong>${money(breakdown.total)}</strong></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #7A6E68; font-size: 13px;">Per payment (×3)</td>
              <td style="padding: 4px 0; color: #7A6E68; font-size: 13px; text-align: right;">${money(Math.round(breakdown.total / 3))}</td>
            </tr>
          </table>` : `
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; border-top: 1px solid #E0D8D0; padding-top: 14px; margin-top: 14px;">
            ${upgrades?.length ? `<tr><td style="padding: 5px 0; color: #7A6E68;">Upgrades</td><td style="padding: 5px 0; color: #1C1814;">${upgrades.join(', ')}</td></tr>` : ''}
            ${(discounts5?.length || discounts10?.length) ? `<tr><td style="padding: 5px 0; color: #7A6E68;">Discounts</td><td style="padding: 5px 0; color: #1C1814;">${[...(discounts5 || []), ...(discounts10 || [])].join(', ')}</td></tr>` : ''}
            <tr><td style="padding: 5px 0; color: #7A6E68; font-size: 15px;"><strong>Estimate</strong></td><td style="padding: 5px 0; color: #2E7D54; font-size: 15px;"><strong>${money(estimate)}</strong></td></tr>
            <tr><td style="padding: 5px 0; color: #7A6E68;">Per payment (×3)</td><td style="padding: 5px 0; color: #1C1814;">${money(perPayment)}</td></tr>
          </table>`}
        </div>

        ${nextSteps?.length ? `
        <div style="margin-bottom: 16px;">
          <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #7A6E68; margin: 0 0 6px;">Next steps requested</p>
          <p style="font-size: 14px; color: #1C1814; margin: 0;">${nextSteps.join(' · ')}</p>
        </div>` : ''}

        ${notes ? `
        <div style="background: #FFF8E7; border-left: 3px solid #C9974E; padding: 14px 18px; margin-bottom: 20px;">
          <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8A6A2E; margin: 0 0 6px;">Note from the couple</p>
          <p style="font-size: 14px; color: #1C1814; margin: 0; line-height: 1.5;">${notes}</p>
        </div>` : ''}

        ${utmBits ? `<p style="font-size: 12px; color: #7A6E68; margin-top: 16px;"><strong>Attribution:</strong> ${utmBits}</p>` : ''}
      </div>
    `

    const venueSubject = wantsContract
      ? `Contract requested: ${p1Name}${p2Name ? ` & ${p2Name}` : ''}${weddingDate ? ` — ${weddingDate}` : ''} — $${estimate?.toLocaleString()}`
      : `New estimate: ${p1Name}${p2Name ? ` & ${p2Name}` : ''}${weddingDate ? ` — ${weddingDate}` : ''} — $${estimate?.toLocaleString()}`

    await Promise.allSettled([
      // Email to couple (no info@ CC — the dedicated venue notification
      // below is the single record for Bloom / the inbox to ingest).
      resend.emails.send({
        from: 'Rixey Manor <hello@rixeymanor.com>',
        to: p1Email,
        subject: 'Your Rixey Manor estimate',
        html: coupleHtml,
      }),
      // Email to venue
      resend.emails.send({
        from: 'Rixey Manor Calculator <hello@rixeymanor.com>',
        to: 'info@rixeymanor.com',
        subject: venueSubject,
        html: venueHtml,
      }),
    ])
  }

  // 3. ContractHouse handoff — when the couple asked to be sent a contract,
  // forward the structured calculator output so ContractHouse drafts a contract
  // for the venue to review and send. Best-effort: a handoff failure never
  // breaks the calculator submission (the couple still gets their estimate
  // email, and the venue can draft the contract manually).
  const wantsContract = nextSteps?.some((s) => /contract/i.test(s))
  let contractDraftId = null
  const chSecret = process.env.CONTRACTHOUSE_CALCULATOR_SECRET
  const chUrl = process.env.CONTRACTHOUSE_URL || 'https://contracthouse.vercel.app'

  if (
    wantsContract &&
    chSecret &&
    packageKey &&
    typeof subtotalPreTax === 'number' &&
    typeof weddingDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(weddingDate)
  ) {
    try {
      const res = await fetch(`${chUrl}/api/calculator/handoff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Calculator-Secret': chSecret,
        },
        body: JSON.stringify({
          venue_slug: 'rixey-manor',
          partner_1_name: p1Name,
          partner_1_email: p1Email,
          partner_1_phone: p1Phone || null,
          partner_2_name: p2Name || null,
          partner_2_email: p2Email || null,
          partner_2_phone: p2Phone || null,
          wedding_date_start: weddingDate,
          subtotal: subtotalPreTax,
          package: packageKey,
          addons: addons || {},
          context: { season: seasonKey || null, guests: guests || null },
        }),
      })
      if (res.ok) {
        const json = await res.json()
        contractDraftId = json?.contract_id ?? null
      } else {
        console.error('[calculator-submit] ContractHouse handoff failed:', res.status, await res.text())
      }
    } catch (e) {
      console.error('[calculator-submit] ContractHouse handoff error:', e?.message || e)
    }
  }

  return Response.json({ ok: true, contractDraftId })
}
