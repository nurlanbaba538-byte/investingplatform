type Props = {
  current: number
  stop:    number
  entry:   number
  target1: number
  target2?: number
}

function pctDiff(from: number, to: number): string {
  const p = ((to - from) / from) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

export default function PriceStrip({ current, stop, entry, target1, target2 }: Props) {
  const riskPts   = Math.abs(entry - stop)
  const reward1   = Math.abs(target1 - entry)
  const rr1       = riskPts > 0 ? (reward1 / riskPts).toFixed(1) : '—'
  const reward2   = target2 ? Math.abs(target2 - entry) : null
  const rr2       = reward2 && riskPts > 0 ? (reward2 / riskPts).toFixed(1) : null

  const allPrices = [stop, entry, current, target1, ...(target2 ? [target2] : [])].sort((a,b)=>a-b)
  const min = allPrices[0]
  const max = allPrices[allPrices.length - 1]
  const range = max - min || 1

  function pos(price: number): string {
    return `${((price - min) / range) * 100}%`
  }

  const points = [
    { price:stop,    icon:'🛑', label:'Stop',    color:'text-[var(--red)]',         pos:pos(stop)    },
    { price:entry,   icon:'⬆',  label:'Giriş',   color:'text-[var(--amber)]',       pos:pos(entry)   },
    { price:current, icon:'📍', label:'Cari',    color:'text-[var(--text-primary)]', pos:pos(current) },
    { price:target1, icon:'🎯', label:'Hədəf 1', color:'text-[var(--green)]',        pos:pos(target1) },
    ...(target2 ? [{ price:target2, icon:'🏆', label:'Hədəf 2', color:'text-[var(--green-bright)]', pos:pos(target2) }] : []),
  ].sort((a,b)=>a.price - b.price)

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-ui mb-4">Qiymət Şeridı</p>

      {/* Strip */}
      <div className="relative h-8 mb-6">
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--bg-card-2)] rounded-full -translate-y-1/2" />
        {/* Fill: stop → target1 */}
        <div
          className="absolute top-1/2 h-1 bg-[var(--text-accent)] opacity-30 rounded-full -translate-y-1/2"
          style={{ left:pos(Math.min(stop,entry)), width:`calc(${pos(Math.max(target1,current))} - ${pos(Math.min(stop,entry))})` }}
        />
        {/* Points */}
        {points.map(p => (
          <div key={p.label} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left:p.pos }}>
            <span className="text-base">{p.icon}</span>
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="grid gap-y-1.5">
        {points.map(p => (
          <div key={p.label} className="flex items-center justify-between text-xs">
            <span className="font-ui text-[var(--text-secondary)] flex items-center gap-1.5">
              <span>{p.icon}</span><span>{p.label}</span>
            </span>
            <span className={`font-data font-semibold ${p.color}`}>
              ${p.price.toFixed(2)}
              {p.label !== 'Cari' && (
                <span className="text-[var(--text-secondary)] font-normal ml-1">
                  ({pctDiff(entry, p.price)})
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* R/R */}
      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-xs text-[var(--text-secondary)] font-ui">Risk/Gəlir</span>
        <div className="text-right">
          <p className={`text-lg font-bold font-data ${parseFloat(rr1) >= 2 ? 'text-[var(--green)]' : 'text-[var(--amber)]'}`}>
            1 : {rr1}
          </p>
          {rr2 && <p className="text-xs text-[var(--green-bright)] font-data">Hədəf 2 → 1:{rr2}</p>}
        </div>
      </div>
    </div>
  )
}
