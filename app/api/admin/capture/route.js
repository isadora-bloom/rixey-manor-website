import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

function auth(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

const SITE_IMAGE_SLOTS = {
  'venue-hero':              'Venue page hero — dramatic full-bleed image of the estate',
  'home-hero':               'Home page hero — best overall estate shot',
  'home-spaces-ceremony':    'Home → Ceremony space — the lake/carriage steps ceremony site',
  'home-spaces-terrace':     'Home → Terrace — string lights, outdoor entertaining area',
  'home-spaces-ballroom':    'Home → Ballroom — the main reception room',
  'home-spaces-bar':         'Home → Bar section',
  'home-quiz-bg':            'Home → Quiz section background',
  'venue-room-newlywed':     'Room: Newlywed Suite',
  'venue-room-maple':        'Room: Maple Room',
  'venue-room-mountain':     'Room: Mountain Room',
  'venue-room-back':         'Room: Garden Room',
  'venue-room-cottage':      'Room: Blacksmith Cottage',
  'venue-team-isadora':      'Team photo: Isadora (the owner)',
  'venue-team-grace':        'Team photo: Grace',
  'venue-story-isadora':     'Story section: Isadora candid photo',
  'availability-hero':       'Availability page hero',
  'availability-spring':     'Availability: Spring season image',
  'availability-summer':     'Availability: Summer season image',
  'availability-fall':       'Availability: Fall/autumn season image',
  'availability-winter':     'Availability: Winter season image',
}

export async function POST(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file')
  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const mediaType = file.type || 'image/jpeg'

  const client = new Anthropic()

  const slotsText = Object.entries(SITE_IMAGE_SLOTS)
    .map(([id, label]) => `  ${id}: ${label}`)
    .join('\n')

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        {
          type: 'text',
          text: `You are helping manage content for Rixey Manor, a historic wedding estate in rural Virginia. The business runs weddings and needs to keep the website updated with photos, testimonials, and other content.

Analyse this image and return a JSON object with these fields:

- "what": one sentence describing exactly what the image shows
- "type": one of: "venue_photo" | "portrait" | "testimonial_screenshot" | "social_screenshot" | "review_screenshot" | "text_document" | "graphic_logo" | "other"
- "suggestions": array of up to 3 suggested actions, ordered by confidence. Each suggestion has:
  - "action": one of "add_to_gallery" | "set_site_image" | "save_testimonial" | "ignore"
  - "label": short label for a button, e.g. "Add to gallery" or "Set as ballroom image"
  - "reason": one sentence explaining why
  - "confidence": "high" | "medium" | "low"
  - "slot": (only for set_site_image) the slot ID from this list:
${slotsText}
  - "scene_type": (only for add_to_gallery) one of: ceremony | ballroom | terrace | grounds | rooms | details | couple | reception | portraits | other
  - "alt_text": (only for add_to_gallery or set_site_image) a descriptive alt text for the image
- "extracted_text": any readable text in the image (a review, a quote, a caption), or null
- "notes": any useful observation, e.g. "image is low resolution" or "appears to be from Instagram"

Return only valid JSON with no markdown fences.`,
        },
      ],
    }],
  })

  try {
    const text = response.content[0].text.trim()
    const analysis = JSON.parse(text)
    return NextResponse.json(analysis)
  } catch {
    return NextResponse.json({ error: 'Could not parse AI response', raw: response.content[0].text }, { status: 500 })
  }
}
