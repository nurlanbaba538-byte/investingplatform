type Props = {
  pctAbove50dma: number
  naaim: number
  rspSpyRs?: number | null
  qqqeQqqRs?: number | null
}

type RowDef = {
  label: string
  value: string
  note: string
  level: 'green' | 'amber' | 'red'
}

export default function BreadthPanel({ pctAbove50dma, naaim, rspSpyRs, qqqeQqqRs }: Props) {
  const rows: RowDef[] = [
    {
      label: 'S&P 500 >50GHO %',
      value: `${pctAbove50dma}%`,
      note: pctAbove50dma > 65 ? 'Sağlam — çoxluq trend üzərindədir' : pctAbove50dma > 50 ? 'Orta — diqqət edin' : 'Zəif genişlik',
      level: pctAbove50dma > 65 ? 'green' : pctAbove50dma > 50 ? 'amber' : 'red',
    },
    {
      label: 'NAAIM Mövqeyi',
      value: naaim.toFixed(2),
      note: naaim > 90 ? '⚠ Kontrarian xəbərdarlıq — tam investisiyalı' : naaim > 70 ? 'Yüksək — diqqətli olun' : 'Normal zona',
      level: naaim > 90 ? 'red' : naaim > 70 ? 'amber' : 'green',
    },
    {
      label: 'RSP/SPY RS (1 il)',
      value: rspSpyRs != null ? `${rspSpyRs >= 0 ? '+' : ''}${rspSpyRs.toFixed(1)}%` : '—',
      note: rspSpyRs != null ? (rspSpyRs > 0 ? 'Geniş bazar liderliyi — sağlam' : 'Dar liderlik — diqqət') : 'yoxlanılmadı',
      level: rspSpyRs != null ? (rspSpyRs > 0 ? 'green' : 'amber') : 'amber',
    },
    {
      label: 'QQQE/QQQ RS (1 il)',
      value: qqqeQqqRs != null ? `${qqqeQqqRs >= 0 ? '+' : ''}${qqqeQqqRs.toFixed(1)}%` : '—',
      note: qqqeQqqRs != null ? (qqqeQqqRs > 0 ? 'Bərabər paylanma — sağlam' : 'Konsentrasiya var — diqqət') : 'yoxlanılmadı',
      level: qqqeQqqRs != null ? (qqqeQqqRs > 0 ? 'green' : 'amber') : 'amber',
    },
  ]

  const dotStyle = { green: 'bg-[var(--green)]', amber: 'bg-[var(--amber)]', red: 'bg-[var(--red)]' }
  const valStyle = { green: 'text-[var(--green)]', amber: 'text-[var(--amber)]', red: 'text-[var(--red)]' }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {rows.map((row) => (
        <div key={row.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 flex gap-3">
          <span className={`mt-1 shrink-0 w-2 h-2 rounded-full ${dotStyle[row.level]}`} />
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-ui font-semibold">{row.label}</p>
            <p className={`text-xl font-bold font-data ${valStyle[row.level]}`}>{row.value}</p>
            <p className="text-xs text-[var(--text-secondary)] font-ui">{row.note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
