import { Suspense } from 'react'
import Quiz from '@/components/quiz/Quiz'
import { supabaseServer } from '@/lib/supabaseServer'
const supabase = supabaseServer()

async function getCalendlyUrl() {
  const { data } = await supabase.from('site_content').select('value').eq('key', 'calendly_url').single()
  return data?.value || ''
}

export async function generateMetadata({ searchParams }) {
  const r = (await searchParams)?.r

  const base = {
    alternates: { canonical: 'https://www.rixeymanor.com/quiz' },
  }

  if (r === '1') return {
    ...base,
    title: { absolute: "You're a Rixey Couple — Rixey Manor" },
    description: "The whole-weekend thing. The no-vendor-list thing. You weren't looking for a venue to fit into — you were looking for a place that fits you.",
    openGraph: {
      title: "You already knew, didn't you.",
      description: "Come and see it. We think you'll walk in and stop talking mid-sentence.",
      url: 'https://www.rixeymanor.com/quiz?r=1',
      images: [{ url: '/assets/quiz-tier-1.webp', width: 1200, height: 1600 }],
    },
  }

  if (r === '2') return {
    ...base,
    title: { absolute: 'Worth a Conversation — Rixey Manor' },
    description: "You're not a certain-no and you're not a certain-yes. Those are exactly the things a tour is for.",
    openGraph: {
      title: 'Worth a conversation. Possibly a very good one.',
      description: "Rixey isn't for every couple — but we've got a hunch about you.",
      url: 'https://www.rixeymanor.com/quiz?r=2',
      images: [{ url: '/assets/quiz-tier-2.webp', width: 1200, height: 1600 }],
    },
  }

  if (r === '3') return {
    ...base,
    title: { absolute: "Rixey's Not Your Venue — Rixey Manor" },
    description: "Not every couple wants a whole estate in rural Virginia for a weekend. That's actually useful information.",
    openGraph: {
      title: "Rixey's not your venue. That's actually useful information.",
      description: 'Some people want something closer, something bigger, something with the catering already sorted.',
      url: 'https://www.rixeymanor.com/quiz?r=3',
      images: [{ url: '/assets/quiz-tier-3.webp', width: 1200, height: 1600 }],
    },
  }

  return {
    ...base,
    title: { absolute: 'Is Rixey the Right Fit For You? — Rixey Manor' },
    description: "A few honest questions. Find out if Rixey Manor is what you've been looking for. We'll tell you the truth — even if the answer is no.",
    openGraph: {
      title: 'Is Rixey the right fit for you?',
      description: "Take the quiz and find out. We'll be honest with you — even if the answer is no.",
      url: 'https://www.rixeymanor.com/quiz',
      images: [{ url: '/assets/quiz-tier-1.webp', width: 1200, height: 1600 }],
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
    { '@type': 'ListItem', position: 2, name: 'Are We Your Venue?', item: 'https://www.rixeymanor.com/quiz' },
  ],
}

export default async function QuizPage() {
  const calendlyUrl = await getCalendlyUrl()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Suspense fallback={<div className="min-h-screen bg-[var(--cream)]" />}>
        <Quiz calendlyUrl={calendlyUrl} />
      </Suspense>
    </>
  )
}
