import StatusPill from '@/components/ui/StatusPill'

type IndexData = {
  ticker: string
  name: string
  price: number
  change: number
  changePct: number
  sma50: number
  sma200: number
  rsi: number
  macdHist: number
  yearHigh: number
  stage: 1 | 2 | 3 | 4
  stageQual: string
  action?: string
}

type Props = { indices: IndexData[] }

function pctFromSma(price: number, sma: number) {
  return (((price - sma) / sma) * 100).toFixed(1)
}

function rsiLabel(rsi: number): { text: string; color: string } {
  if (rsi > 75) return { text: '⚠ HƏDDINDƏN ARTIQ ALINMIŞ', color: 'text-[var(--red)]' }
  if (rsi > 70) return { text: 'ALINMIŞ', color: 'text-[var(--amber)]' }
  if (rsi < 30) return { text: '⚠ SATILMIŞ', color: 'text-[var(--green)]' }
  if (rsi < 40) return { text: 'ZƏİF MOMENT', color: 'text-[var(--amber)]' }
  return { text: 'NORMAL', color: 'text-[var(--text-secondary)]' }
}

const stageVariant: Record<number, 'stage1' | 'stage2' | 'stage3' | 'stage4'> = {
  1: 'stage1', 2: 'stage2', 3: 'stage3', 4: 'stage4',
}

export default function IndexCards({ indices }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {indices.map((idx) => {
        const sma50pct  = pctFromSma(idx.price, idx.sma50)
        const sma200pct = pctFromSma(idx.price, idx.sma200)
        const athPct    = (((idx.yearHigh - idx.price) / idx.price) * 100).toFixed(1)
        const rsiInfo   = rsiLabel(idx.rsi)
        const changePos = idx.changePct >= 0

        return (
          <div key={idx.ticker} className="bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-active)] rounded-lg p-4 space-y-3 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-[var(--text-primary)] font-data">{idx.ticker}</span>
                <p className="text-[10px] text-[var(--text-secondary)] font-ui">{idx.name}</p>
              </div>
              <StatusPill label={`STAGE ${idx.stage} · ${idx.stageQual}`} variant={stageVariant[idx.stage]} />
            </div>

            {/* Price */}
            <div>
              <p className="text-2xl font-bold font-data text-[var(--text-primary)]">
                {idx.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-sm font-data font-medium ${changePos ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                {changePos ? '↑' : '↓'} {changePos ? '+' : ''}{idx.changePct.toFixed(2)}% &nbsp;
                <span className="text-xs opacity-70">({changePos ? '+' : ''}{idx.change.toFixed(2)})</span>
              </p>
            </div>

            {/* SMA */}
            <div className="space-y-1 text-xs font-ui border-t border-[var(--border)] pt-2">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">50 GHO ≈ {idx.sma50.toFixed(2)}</span>
                <span className={parseFloat(sma50pct) >= 0 ? 'text-[var(--green)] font-data' : 'text-[var(--red)] font-data'}>
                  {parseFloat(sma50pct) >= 0 ? '+' : ''}{sma50pct}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">200 GHO ≈ {idx.sma200.toFixed(2)}</span>
                <span className={parseFloat(sma200pct) >= 0 ? 'text-[var(--green)] font-data' : 'text-[var(--red)] font-data'}>
                  {parseFloat(sma200pct) >= 0 ? '+' : ''}{sma200pct}%
                </span>
              </div>
            </div>

            {/* RSI + MACD */}
            <div className="space-y-1 text-xs border-t border-[var(--border)] pt-2">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)] font-ui">RSI(14)</span>
                <span className={`font-data font-medium ${rsiInfo.color}`}>{idx.rsi.toFixed(1)} — {rsiInfo.text}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)] font-ui">MACD hist</span>
                <span className={`font-data ${idx.macdHist >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                  {idx.macdHist >= 0 ? '+' : ''}{idx.macdHist.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)] font-ui">İllik zirvədən</span>
                <span className="font-data text-[var(--text-mono)]">-{athPct}%</span>
              </div>
            </div>

            {/* Action */}
            {idx.action && (
              <div className="border-t border-[var(--border)] pt-2">
                <p className="text-[10px] text-[var(--text-accent)] font-ui italic">{idx.action}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
