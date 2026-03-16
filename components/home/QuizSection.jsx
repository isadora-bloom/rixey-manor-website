import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'

export default function QuizSection({ quizUrl = '', backgroundImage = null }) {
  return (
    <section className="relative py-24 lg:py-32 px-6 lg:px-10 overflow-hidden bg-[var(--forest)]">

      {/* Background photo */}
      {backgroundImage?.url && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage.url}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[var(--forest)]/80" />
        </div>
      )}

      {/* Sketch watermark — only show when no photo */}
      {!backgroundImage?.url && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.10]">
          <Image
            src="/assets/rixey-manor-logo.png"
            alt=""
            width={500}
            height={420}
            className="object-contain w-[360px] lg:w-[460px]"
          />
        </div>
      )}

      <div className="relative max-w-2xl mx-auto text-center">
        <FadeUp>
          <p className="eyebrow-sage mb-6">Not every venue is for every couple</p>
          <h2
            className="text-[36px] lg:text-[46px] leading-[1.1] text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Is Rixey the right fit<br /><em>for you?</em>
          </h2>
          <p
            className="text-[17px] leading-[1.75] text-[var(--rose-light)] mb-10 max-w-lg mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Three minutes. Ten questions. Find out if Rixey is what you've been
            looking for. If it is, we'll tell you exactly why.
          </p>

          <div className="flex flex-col items-center gap-4">
            <a href="/quiz" className="btn-rose">
              Take the quiz
            </a>
            <p
              className="text-[12px] tracking-[0.12em] uppercase text-[var(--sage-light)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              No email required to see your result.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
