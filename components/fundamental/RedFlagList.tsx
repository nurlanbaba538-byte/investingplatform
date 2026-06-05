import { type ScoredStock } from '@/lib/fundamental'

type Props = { stocks: ScoredStock[] }

export default function RedFlagList({ stocks }: Props) {
  const withFlags = stocks.filter(s => s.redFlags.length > 0)
  if (withFlags.length === 0) return null

  return (
    <div className="space-y-2">
      {withFlags.map(s => (
        <div key={s.ticker} className="bg-[var(--bg-card)] border border-[var(--border)] border-l-4 border-l-[var(--red)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold font-data text-[var(--text-accent)]">{s.ticker}</span>
            <span className="text-xs text-[var(--text-secondary)] font-ui">{s.name}</span>
            <span className="ml-auto text-xs font-data text-[var(--red)]">{s.total}/150</span>
          </div>
          <div className="space-y-1">
            {s.redFlags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2 text-xs font-ui text-[var(--text-secondary)]">
                <span className="text-[var(--red)] shrink-0">⚠</span>
                <span>{flag}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
