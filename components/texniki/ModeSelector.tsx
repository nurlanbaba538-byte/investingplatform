'use client'

export type AnalysisMode = 'chart' | 'ticker' | 'csv'

type ModeOption = {
  id:    AnalysisMode
  icon:  string
  title: string
  sub:   string
}

const MODES: ModeOption[] = [
  { id:'chart',  icon:'📊', title:'Chart Yüklə',      sub:'JPG/PNG şəkli — Claude görür' },
  { id:'ticker', icon:'🔍', title:'Ticker Daxil Et',  sub:'FMP API-dən avtomatik data' },
  { id:'csv',    icon:'📋', title:'CSV Yüklə',         sub:'investing.com texniki indikatorlar' },
]

type Props = {
  selected: AnalysisMode
  onChange: (mode: AnalysisMode) => void
}

export default function ModeSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {MODES.map(m => {
        const active = selected === m.id
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`
              rounded-lg p-4 text-left transition-colors border
              ${active
                ? 'bg-[var(--bg-hover)] border-[var(--text-accent)]'
                : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-active)] hover:bg-[var(--bg-hover)]'
              }
            `}
          >
            <p className="text-xl mb-2">{m.icon}</p>
            <p className={`text-sm font-semibold font-ui ${active ? 'text-[var(--text-accent)]' : 'text-[var(--text-primary)]'}`}>
              {m.title}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)] font-ui mt-0.5">{m.sub}</p>
            {active && <div className="h-0.5 bg-[var(--text-accent)] rounded-full mt-2" />}
          </button>
        )
      })}
    </div>
  )
}
