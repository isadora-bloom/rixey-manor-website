// Pure constants and helpers that are safe to import from client components.
// Don't put anything that touches Supabase / fs / process.env in here.

export const CATEGORY_LABELS = {
  'practical-advice': 'Practical Advice',
  'real-rixey':       'Real Rixey',
  'budgeting':        'Budgeting',
  'rixey-specific':   'Rixey Life',
  'pep-talk':         'Pep Talk',
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
