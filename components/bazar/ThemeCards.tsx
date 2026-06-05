type ThemeCard = { signal: string; title: string; body: string }
type Props = { cards: ThemeCard[] }

const signalStyle: Record<string, { border: string; badge: string }> = {
  'AL':     { border: 'border-l-[var(--green)]',        badge: 'bg-[var(--green)] text-[#06080F]' },
  'SAT':    { border: 'border-l-[var(--red)]',          badge: 'bg-[var(--red)] text-white' },
  'TUT':    { border: 'border-l-[var(--blue)]',         badge: 'bg-[var(--blue)] text-white' },
  'KƏS':    { border: 'border-l-[var(--amber)]',        badge: 'bg-[var(--amber)] text-[#06080F]' },
  'GÖZLƏ': { border: 'border-l-[var(--text-secondary)]', badge: 'bg-[var(--bg-card-2)] text-[var(--text-secondary)]' },
  'QADAĞAN':{ border: 'border-l-[var(--red)]',          badge: 'bg-[#7f1d1d] text-[var(--red)]' },
}

export default function ThemeCards({ cards }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {cards.map((card, i) => {
        const style = signalStyle[card.signal] ?? signalStyle['GÖZLƏ']
        return (
          <div key={i} className={`bg-[var(--bg-card)] border border-[var(--border)] border-l-4 ${style.border} rounded-lg p-4 space-y-2`}>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-ui ${style.badge}`}>
                {card.signal}
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)] font-ui leading-snug">{card.title}</p>
            <p className="text-xs text-[var(--text-secondary)] font-ui leading-relaxed">{card.body}</p>
          </div>
        )
      })}
    </div>
  )
}
