import { type EightLayerScore } from '@/lib/calculations'

type Props = { data: EightLayerScore; ticker: string; swingTotal?: number }

const labelStyle = {
  'GÜCLÜ': { badge:'bg-[var(--green)] text-[#06080F]',  bar:'bg-[var(--green)]'  },
  'İZLƏ':  { badge:'bg-[var(--amber)] text-[#06080F]',  bar:'bg-[var(--amber)]'  },
  'GÖZLƏ': { badge:'bg-[#f97316] text-white',            bar:'bg-[#f97316]'       },
  'DEYİL': { badge:'bg-[var(--red)] text-white',         bar:'bg-[var(--red)]'    },
}

function Dots({ score, max }: { score: number; max: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`w-2.5 h-2.5 rounded-full ${i < score ? 'bg-[var(--text-accent)]' : 'bg-[var(--bg-card-2)]'}`} />
      ))}
    </span>
  )
}

export default function ScoreCard({ data, ticker, swingTotal }: Props) {
  const style = labelStyle[data.label]
  const pct   = (data.total / 24) * 100

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold font-data text-[var(--text-accent)]">{ticker}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-ui ${style.badge}`}>
            {data.label}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold font-data text-[var(--text-primary)]">{data.total}<span className="text-sm text-[var(--text-secondary)]">/24</span></p>
          {swingTotal !== undefined && (
            <p className="text-[10px] text-[var(--text-secondary)] font-ui">Swing: {swingTotal}/100</p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--bg-card-2)]">
        <div className={`h-full transition-all ${style.bar}`} style={{ width:`${pct}%` }} />
      </div>

      {/* Layers */}
      <div className="divide-y divide-[var(--border)]">
        {data.layers.map((layer) => (
          <div key={layer.name} className="px-4 py-2.5 flex items-center gap-3">
            <span className="text-xs text-[var(--text-primary)] font-ui w-36 shrink-0">{layer.name}</span>
            <Dots score={layer.score} max={layer.max} />
            <span className="text-[10px] font-data text-[var(--text-accent)] w-8 text-center">{layer.score}/{layer.max}</span>
            <span className="text-[10px] text-[var(--text-secondary)] font-ui flex-1 truncate">{layer.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
