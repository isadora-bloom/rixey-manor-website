import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function QuizPage() {
  notFound()
}
