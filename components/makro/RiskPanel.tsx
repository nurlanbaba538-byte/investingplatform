type RiskLevel = 'green' | 'amber' | 'red'

type RiskApiData = {
  t10y2y?: number | null
  t10y3m?: number | null
  hyoas?: number | null
  sahm?: number | null
  vix?: number | null
}
type Props = { apiData?: RiskApiData | null }

function spreadLevel(v: number | null | undefined): RiskLevel {
  if (v == null) return 'amber'
  if (v < -0.3) return 'red'
  if (v < 0) return 'amber'
  return 'green'
}
function hyLevel(v: number | null | undefined): RiskLevel {
  if (v == null) return 'amber'
  const bp = v * 100
  if (bp > 500) return 'red'
  if (bp > 300) return 'amber'
  return 'green'
}
function sahmLevel(v: number | null | undefined): RiskLevel {
  if (v == null) return 'amber'
  if (v > 0.5) return 'red'
  if (v > 0.3) return 'amber'
  return 'green'
}
function vixLevel(v: number | null | undefined): RiskLevel {
  if (v == null) return 'amber'
  if (v > 28) return 'red'
  if (v > 18) return 'amber'
  return 'green'
}

const dotStyle: Record<RiskLevel, string> = {
  green: 'bg-[var(--green)]',
  amber: 'bg-[var(--amber)]',
  red:   'bg-[var(--red)]',
}
const valStyle: Record<RiskLevel, string> = {
  green: 'text-[var(--green)]',
  amber: 'text-[var(--amber)]',
  red:   'text-[var(--red)]',
}

export default function RiskPanel({ apiData }: Props) {
  const d = apiData ?? {}

  const ROWS = [
    {
      label: '10Y-2Y ƏYRİSİ',
      value: d.t10y2y != null ? `${d.t10y2y > 0 ? '+' : ''}${d.t10y2y.toFixed(2)}%` : null,
      level: spreadLevel(d.t10y2y),
      note: 'Tərsinə çevrilmişsə — resessiya siqnalı',
      verified: d.t10y2y != null,
    },
    {
      label: '10Y-3M ƏYRİSİ',
      value: d.t10y3m != null ? `${d.t10y3m > 0 ? '+' : ''}${d.t10y3m.toFixed(2)}%` : null,
      level: spreadLevel(d.t10y3m),
      note: 'Fed modelinin əsas göstəricisi',
      verified: d.t10y3m != null,
    },
    {
      label: 'HY KREDİT SPREADİ',
      value: d.hyoas != null ? `${(d.hyoas * 100).toFixed(0)}bp` : null,
      level: hyLevel(d.hyoas),
      note: '300bp altı sağlam, 500bp+ alarm',
      verified: d.hyoas != null,
    },
    {
      label: 'SAHM QAYDASI',
      value: d.sahm != null ? d.sahm.toFixed(2) : null,
      level: sahmLevel(d.sahm),
      note: '0.5+ — resessiya ehtimalı yüksək',
      verified: d.sahm != null,
    },
    {
      label: 'VIX',
      value: d.vix != null ? d.vix.toFixed(2) : null,
      level: vixLevel(d.vix),
      note: '18 altı sakit, 28+ alarm',
      verified: d.vix != null,
    },
    {
      label: 'VVIX',
      value: null,
      level: 'amber' as RiskLevel,
      note: '100 altı normal',
      verified: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {ROWS.map((row) => (
        <div key={row.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 flex gap-3">
          <span className={`mt-1 shrink-0 w-2 h-2 rounded-full ${dotStyle[row.level]}`} />
          <div className="space-y-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-ui font-semibold">{row.label}</p>
            <p className={`text-xl font-bold font-data ${row.value ? valStyle[row.level] : 'text-[var(--text-secondary)]'}`}>
              {row.value ?? '—'}
            </p>
            <p className="text-xs text-[var(--text-secondary)] font-ui">{row.note}</p>
            {!row.verified && <p className="text-[10px] italic text-[var(--amber)] font-ui">yoxlanılmadı</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
