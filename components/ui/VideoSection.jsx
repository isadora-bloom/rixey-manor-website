'use client'
import { useState, useRef } from 'react'

/**
 * VideoSection — drop-in video feature block.
 *
 * Supports mp4 URLs, YouTube (watch?v= or youtu.be), and Vimeo.
 * YouTube/Vimeo always use iframe embed. mp4 uses native <video>.
 *
 * Props:
 *   videoUrl      — URL of the video (mp4, YouTube, or Vimeo)
 *   posterImage   — image object { url, alt_text } from site_images (fallback poster)
 *   heading       — optional overlay heading
 *   eyebrow       — optional small label above heading
 *   autoplay      — true = silent background loop (mp4 only), false = player with play button
 */

function getEmbedInfo(url) {
  if (!url) return null

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return { type: 'youtube', id: ytMatch[1] }

  // Vimeo
  const vmMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vmMatch) return { type: 'vimeo', id: vmMatch[1] }

  // Native mp4
  return { type: 'mp4' }
}

export default function VideoSection({
  videoUrl,
  posterImage,
  heading,
  eyebrow,
  autoplay = false,
}) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)

  if (!videoUrl) return null

  const embed = getEmbedInfo(videoUrl)

  // ── Autoplay background loop (mp4 only) ──────────────────────────────────
  if (autoplay && embed?.type === 'mp4') {
    return (
      <div className="relative w-full h-[55vh] lg:h-[70vh] overflow-hidden bg-[var(--ink)]">
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
          poster={posterImage?.url}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[var(--ink)]/30" />
        {(eyebrow || heading) && (
          <div className="absolute inset-0 flex items-end px-6 lg:px-10 pb-12 lg:pb-16">
            <div className="max-w-2xl">
              {eyebrow && <p className="eyebrow mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{eyebrow}</p>}
              {heading && (
                <h2 className="text-[28px] lg:text-[40px] leading-[1.1]" style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}>
                  {heading}
                </h2>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Featured player — YouTube / Vimeo iframe ──────────────────────────────
  if (embed?.type === 'youtube' || embed?.type === 'vimeo') {
    const src = embed.type === 'youtube'
      ? `https://www.youtube.com/embed/${embed.id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${embed.id}?autoplay=1`

    const thumbSrc = embed.type === 'youtube'
      ? `https://img.youtube.com/vi/${embed.id}/maxresdefault.jpg`
      : null

    return (
      <section className="bg-[var(--ink)] py-16 lg:py-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          {(eyebrow || heading) && (
            <div className="mb-8">
              {eyebrow && <p className="eyebrow mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{eyebrow}</p>}
              {heading && (
                <h2 className="text-[26px] lg:text-[34px] leading-[1.1]" style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}>
                  {heading}
                </h2>
              )}
            </div>
          )}
          <div className="relative w-full aspect-video bg-black overflow-hidden">
            {playing ? (
              <iframe
                src={src}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none' }}
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center group w-full h-full"
              >
                {(posterImage?.url || thumbSrc) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={posterImage?.url || thumbSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-[var(--ink)]/25 group-hover:bg-[var(--ink)]/35 transition-colors" />
                <div className="relative z-10 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-[var(--ink)] ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  // ── Featured player — native mp4 ─────────────────────────────────────────
  return (
    <section className="bg-[var(--ink)] py-16 lg:py-20 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        {(eyebrow || heading) && (
          <div className="mb-8">
            {eyebrow && <p className="eyebrow mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{eyebrow}</p>}
            {heading && (
              <h2 className="text-[26px] lg:text-[34px] leading-[1.1]" style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}>
                {heading}
              </h2>
            )}
          </div>
        )}
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            controls={playing}
            className="absolute inset-0 w-full h-full object-cover"
            poster={posterImage?.url}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          {!playing && (
            <button onClick={() => { videoRef.current?.play(); setPlaying(true) }} aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center group">
              <div className="absolute inset-0 bg-[var(--ink)]/20 group-hover:bg-[var(--ink)]/30 transition-colors" />
              <div className="relative z-10 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-[var(--ink)] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
