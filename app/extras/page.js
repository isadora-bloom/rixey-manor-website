import { supabaseServer } from '@/lib/supabaseServer'
import Image from 'next/image'
import FinalCTA from '@/components/home/FinalCTA'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Only at Rixey — The Little Things That Make It Different',
    description: 'Fire pits, food trucks, live painters, horses, lion dances, a copper tub at midnight. The things you couldn\'t do at most venues.',
    alternates: { canonical: 'https://www.rixeymanor.com/extras' },
    openGraph: {
      title: 'Only at Rixey',
      description: 'The things you couldn\'t do at most venues.',
      url: 'https://www.rixeymanor.com/extras',
    },
  }
}

export default async function ExtrasPage() {
  const { data: extras } = await supabaseServer()
    .from('venue_extras')
    .select('id, title, description, quote, image_url')
    .eq('active', true)
    .order('sort_order')

  const items = extras || []

  return (
    <>
      {/* Header */}
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
          Only at Rixey
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 58px)',
          color: 'var(--ink)',
          lineHeight: 1.12,
          marginBottom: 24,
          fontStyle: 'italic',
        }}>
          The things you couldn't<br />do anywhere else.
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'var(--ink-light)',
          maxWidth: 560,
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          Thirty acres. One weekend. Yours completely.
          Here is what that actually means.
        </p>
      </section>

      {/* Grid */}
      <section style={{
        padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 60px)',
        maxWidth: 1280,
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'clamp(16px, 2vw, 28px)',
        }}>
          {items.map(extra => (
            <ExtraCard key={extra.id} extra={extra} />
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  )
}

function ExtraCard({ extra }) {
  return (
    <article style={{
      background: 'white',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {extra.image_url && (
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', flexShrink: 0 }}>
          <Image
            src={extra.image_url}
            alt={extra.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div style={{ padding: '22px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(18px, 2vw, 22px)',
          color: 'var(--ink)',
          marginBottom: 10,
          lineHeight: 1.2,
        }}>
          {extra.title}
        </h2>
        {extra.description && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: 'var(--ink-light)',
            lineHeight: 1.7,
            marginBottom: extra.quote ? 16 : 0,
            flex: 1,
          }}>
            {extra.description}
          </p>
        )}
        {extra.quote && (
          <blockquote style={{
            borderLeft: '2px solid var(--rose)',
            paddingLeft: 14,
            margin: 0,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontStyle: 'italic',
            color: 'var(--ink-mid)',
            lineHeight: 1.6,
          }}>
            "{extra.quote}"
          </blockquote>
        )}
      </div>
    </article>
  )
}
