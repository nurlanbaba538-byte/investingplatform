'use client'

type Props = { text: string; loading?: boolean }

function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-[var(--text-primary)] font-ui mt-4 mb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold text-[var(--text-accent)] font-ui mt-3 mb-1">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--text-primary)] font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-[var(--text-secondary)]">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="text-xs text-[var(--text-secondary)] font-ui ml-3 mb-0.5">• $1</li>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim())
      if (cells.every(c => /^[-\s:]+$/.test(c))) return ''
      const tds = cells.map(c =>
        `<td class="px-2 py-1 text-xs font-ui text-[var(--text-secondary)] border-b border-[var(--border)]">${c.trim()}</td>`
      ).join('')
      return `<tr>${tds}</tr>`
    })
    .replace(/(<tr>[\s\S]*?<\/tr>)+/g, m =>
      `<div class="overflow-x-auto my-2"><table class="w-full bg-[var(--bg-card-2)] rounded">${m}</table></div>`
    )
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}

export default function AnalysisReport({ text, loading }: Props) {
  if (loading && !text) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 space-y-3">
        {[40,60,50,70,45].map((w,i) => (
          <div key={i} className={`h-3 bg-[var(--bg-card-2)] rounded animate-pulse`} style={{ width:`${w}%` }} />
        ))}
      </div>
    )
  }
  if (!text) return null

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] border-l-4 border-l-[var(--text-accent)] rounded-lg p-5">
      <div
        className="text-xs leading-relaxed space-y-1"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
      />
      {loading && (
        <span className="inline-block w-2 h-3 bg-[var(--text-accent)] animate-pulse ml-0.5 rounded-sm" />
      )}
    </div>
  )
}
