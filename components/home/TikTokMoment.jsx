export default function TikTokMoment() {
  return (
    <section style={{
      background: 'var(--warm-white)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: 'clamp(48px, 7vw, 80px) clamp(20px, 5vw, 60px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 28,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--ink-light)',
          marginBottom: 12,
        }}>
          Shot on site
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 4vw, 36px)',
          color: 'var(--ink)',
          lineHeight: 1.15,
          fontStyle: 'italic',
        }}>
          This lift is life.
        </h2>
      </div>

      <iframe
        src="https://www.tiktok.com/embed/v2/7565507952648424718"
        style={{
          width: '100%',
          maxWidth: 380,
          height: 700,
          border: 'none',
          display: 'block',
        }}
        allowFullScreen
        allow="encrypted-media"
        title="Rixey Manor — first dance lift"
      />
    </section>
  )
}
