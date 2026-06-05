type KpiCardProps = {
  label: string
  value: string | number | null
  change?: number | null
  source?: string
  date?: string
  verified?: boolean
  colorOverride?: 'green' | 'red' | 'amber' | 'neutral'
}

function changeColor(change: number, override?: KpiCardProps['colorOverride']): string {
  if (override === 'green') return 'text-[var(--green)]'
  if (override === 'red') return 'text-[var(--red)]'
  if (override === 'amber') return 'text-[var(--amber)]'
  if (override === 'neutral') return 'text-[var(--text-secondary)]'
  return change >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'
}

export default function KpiCard({
  label,
  value,
  change,
  source,
  date,
  verified = true,
  colorOverride,
}: KpiCardProps) {
  const displayValue = value === null || value === undefined ? '—' : value

  return (
    <div className="
      bg-[var(--bg-card)] border border-[var(--border)]
      hover:border-[var(--border-active)] hover:bg-[var(--bg-hover)]
      rounded-lg p-4 transition-colors duration-150 flex flex-col gap-2
    ">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold font-ui leading-tight">
          {label}
        </span>
        {!verified && (
          <span className="text-[10px] italic text-[var(--amber)] shrink-0">yoxlanılmadı</span>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className={`text-3xl font-bold font-data leading-none ${value === null ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
          {displayValue}
        </span>

        {change !== null && change !== undefined && (
          <span className={`text-sm font-data font-medium ${changeColor(change, colorOverride)}`}>
            {change >= 0 ? '↑' : '↓'} {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        )}
      </div>

      {(source || date) && (
        <span className="text-[11px] text-[var(--text-mono)] font-ui mt-auto">
          {[source, date].filter(Boolean).join(' · ')}
        </span>
      )}
    </div>
  )
}
