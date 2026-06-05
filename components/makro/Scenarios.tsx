import { MANUAL_DATA } from '@/lib/manualData'

const { scenarios } = MANUAL_DATA

const CARDS = [
  {
    key: 'up' as const,
    label: '▲ YUXARI SSENARİ',
    borderColor: 'border-[var(--green)]',
    labelColor: 'text-[var(--green)]',
  },
  {
    key: 'neutral' as const,
    label: '= NEYTRAL SSENARİ',
    borderColor: 'border-[var(--amber)]',
    labelColor: 'text-[var(--amber)]',
  },
  {
    key: 'down' as const,
    label: '▼ AŞAĞI SSENARİ',
    borderColor: 'border-[var(--red)]',
    labelColor: 'text-[var(--red)]',
  },
]

export default function Scenarios() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {CARDS.map(({ key, label, borderColor, labelColor }) => {
        const s = scenarios[key]
        return (
          <div key={key} className={`bg-[var(--bg-card)] border border-[var(--border)] ${borderColor} border-t-2 rounded-lg p-4 space-y-3`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest font-ui ${labelColor}`}>{label}</p>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] font-ui mb-0.5">Trigger şərti</p>
                <p className="text-xs text-[var(--text-primary)] font-ui">{s.trigger}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] font-ui mb-0.5">Bazar reaksiyası</p>
                <p className="text-xs text-[var(--text-primary)] font-ui">{s.reaction}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] font-ui mb-0.5">İzləmək üçün</p>
                <p className="text-xs text-[var(--text-accent)] font-data">{s.watch}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
