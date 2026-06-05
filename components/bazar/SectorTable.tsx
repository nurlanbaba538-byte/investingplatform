import StatusPill from '@/components/ui/StatusPill'

type SectorRow = {
  ticker: string
  name: string
  price: number
  changePct: number
  sma50pct: number
  sma200pct: number
  stage: 1 | 2 | 3 | 4
  signal: string
}

type Props = { rows: SectorRow[] }

const signalBadge: Record<string, string> = {
  'AL':      'text-[var(--green-bright)] font-bold',
  'TUT':     'text-[var(--blue)]',
  'GÖZLƏ':  'text-[var(--amber)]',
  'KƏS':    'text-[var(--amber)] font-bold',
  'QADAĞAN':'text-[var(--red)]',
}

const stageVariant: Record<number, 'stage1' | 'stage2' | 'stage3' | 'stage4'> = {
  1: 'stage1', 2: 'stage2', 3: 'stage3', 4: 'stage4',
}

export default function SectorTable({ rows }: Props) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-x-auto">
      <table className="w-full text-xs min-w-[640px]">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {['ETF', 'Ad', 'Qiymət', '% Δ', '50GHO+', '200GHO+', 'Stage', 'Siqnal'].map(h => (
              <th key={h} className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-ui font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const changePos = row.changePct >= 0
            return (
              <tr key={row.ticker} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                <td className="px-3 py-2.5 font-data text-[var(--text-accent)] font-semibold">{row.ticker}</td>
                <td className="px-3 py-2.5 font-ui text-[var(--text-secondary)]">{row.name}</td>
                <td className="px-3 py-2.5 font-data text-[var(--text-primary)]">{row.price.toFixed(2)}</td>
                <td className={`px-3 py-2.5 font-data ${changePos ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                  {changePos ? '+' : ''}{row.changePct.toFixed(2)}%
                </td>
                <td className={`px-3 py-2.5 font-data ${row.sma50pct >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                  {row.sma50pct >= 0 ? '+' : ''}{row.sma50pct.toFixed(1)}%
                </td>
                <td className={`px-3 py-2.5 font-data ${row.sma200pct >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                  {row.sma200pct >= 0 ? '+' : ''}{row.sma200pct.toFixed(1)}%
                </td>
                <td className="px-3 py-2.5">
                  <StatusPill label={`S${row.stage}`} variant={stageVariant[row.stage]} />
                </td>
                <td className={`px-3 py-2.5 font-ui font-semibold uppercase text-[10px] tracking-wide ${signalBadge[row.signal] ?? 'text-[var(--text-secondary)]'}`}>
                  {row.signal}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
