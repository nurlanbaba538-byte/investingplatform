type VixTerm = { label: string; value: number | null }
type SentRow = {
  label: string
  value: string | null
  level: 'green' | 'amber' | 'red'
  note: string
  verified: boolean
}

type Props = {
  vixTerms: VixTerm[]
  sentRows: SentRow[]
}

function structureLabel(terms: VixTerm[]): { text: string; color: string } {
  const vals = terms.map(t => t.value).filter((v): v is number => v !== null)
  if (vals.length < 2) return { text: 'Yoxlanılmadı', color: 'text-[var(--amber)]' }
  const ascending = vals.every((v, i) => i === 0 || v >= vals[i - 1])
  return ascending
    ? { text: 'Kontango — Sağlam', color: 'text-[var(--green)]' }
    : { text: 'Backwardation — Stress', color: 'text-[var(--red)]' }
}

const dotStyle = { green: 'bg-[var(--green)]', amber: 'bg-[var(--amber)]', red: 'bg-[var(--red)]' }
const valStyle = { green: 'text-[var(--green)]', amber: 'text-[var(--amber)]', red: 'text-[var(--red)]' }

export default function SentimentPanel({ vixTerms, sentRows }: Props) {
  const structure = structureLabel(vixTerms)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* VIX Term Structure */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-ui font-semibold">VIX Müddət Strukturu</p>
          <span className={`text-[10px] font-ui font-semibold ${structure.color}`}>{structure.text}</span>
        </div>
        <div className="grid grid-cols-4 divide-x divide-[var(--border)]">
          {vixTerms.map((t) => (
            <div key={t.label} className="p-3 text-center">
              <p className="text-[10px] text-[var(--text-secondary)] font-ui mb-1">{t.label}</p>
              <p className={`text-lg font-bold font-data ${t.value != null ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                {t.value?.toFixed(2) ?? '—'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment rows */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[var(--border)]">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-ui font-semibold">Sentiment Göstəriciləri</p>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {sentRows.map((row) => (
            <div key={row.label} className="px-4 py-2.5 flex items-center gap-3">
              <span className={`shrink-0 w-2 h-2 rounded-full ${dotStyle[row.level]}`} />
              <span className="text-xs text-[var(--text-primary)] font-ui flex-1">{row.label}</span>
              <span className={`text-sm font-bold font-data ${row.value ? valStyle[row.level] : 'text-[var(--text-secondary)]'}`}>
                {row.value ?? '—'}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] font-ui hidden sm:block w-40 text-right">{row.note}</span>
              {!row.verified && <span className="text-[10px] italic text-[var(--amber)] font-ui shrink-0">yoxlanılmadı</span>}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
