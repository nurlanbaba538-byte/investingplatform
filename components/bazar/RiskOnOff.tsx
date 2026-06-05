type RatioRow = { label: string; value: string; signal: 'on' | 'off' | 'neutral' }
type SectorRS  = { ticker: string; name: string; mansfield: number; dailyPct: number }

type Props = {
  ratios: RatioRow[]
  sectorRS: SectorRS[]
}

export default function RiskOnOff({ ratios, sectorRS }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* Risk-On/Off ratios */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[var(--border)]">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-ui font-semibold">Risk-On / Risk-Off Göstəriciləri</p>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {ratios.map((r) => (
            <div key={r.label} className="px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-[var(--text-primary)] font-ui">{r.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-data text-[var(--text-secondary)]">{r.value}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-ui ${
                  r.signal === 'on'      ? 'bg-[var(--green)] text-[#06080F]' :
                  r.signal === 'off'     ? 'bg-[var(--red)] text-white' :
                  'bg-[var(--bg-card-2)] text-[var(--text-secondary)]'
                }`}>
                  {r.signal === 'on' ? 'RISK-ON' : r.signal === 'off' ? 'RISK-OFF' : 'NEYTRAL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Mansfield RS */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[var(--border)]">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-ui font-semibold">11 SPDR Sektoru — Mansfield RS Sıralaması</p>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {sectorRS.map((s, i) => (
            <div key={s.ticker} className="px-4 py-2 flex items-center gap-3">
              <span className="text-[10px] text-[var(--text-secondary)] font-data w-4 shrink-0">{i + 1}</span>
              <span className="text-xs font-data text-[var(--text-accent)] w-10 shrink-0">{s.ticker}</span>
              <span className="text-xs text-[var(--text-secondary)] font-ui flex-1 truncate">{s.name}</span>
              <span className={`text-xs font-data w-14 text-right ${s.mansfield >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                {s.mansfield >= 0 ? '+' : ''}{s.mansfield.toFixed(1)}%
              </span>
              <span className={`text-[10px] font-data w-12 text-right ${s.dailyPct >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                {s.dailyPct >= 0 ? '+' : ''}{s.dailyPct.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
