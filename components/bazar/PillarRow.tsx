type Pillar = { label: string; score: number; note: string }
type Props  = { pillars: Pillar[] }

function barColor(score: number): string {
  if (score >= 70) return 'bg-[var(--green)]'
  if (score >= 45) return 'bg-[var(--amber)]'
  return 'bg-[var(--red)]'
}
function textColor(score: number): string {
  if (score >= 70) return 'text-[var(--green)]'
  if (score >= 45) return 'text-[var(--amber)]'
  return 'text-[var(--red)]'
}

export default function PillarRow({ pillars }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {pillars.map(({ label, score, note }) => (
        <div key={label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3 flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-ui font-semibold">{label}</p>
          <p className={`text-2xl font-bold font-data ${textColor(score)}`}>{score}</p>
          {/* progress bar */}
          <div className="h-1 bg-[var(--bg-card-2)] rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${barColor(score)}`} style={{ width: `${score}%` }} />
          </div>
          <p className="text-[10px] text-[var(--text-secondary)] font-ui leading-tight">{note}</p>
        </div>
      ))}
    </div>
  )
}
