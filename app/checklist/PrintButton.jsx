'use client'

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-primary"
      data-no-print
      aria-label="Print or save this checklist as a PDF"
    >
      Print / save as PDF
    </button>
  )
}
