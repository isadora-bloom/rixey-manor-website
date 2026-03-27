import { NextResponse } from 'next/server'

const FAMILY_PASSWORD = process.env.FAMILY_PASSWORD || 'rixeyfamily'

export async function POST(req) {
  const { password } = await req.json()
  if (!password || password !== FAMILY_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
