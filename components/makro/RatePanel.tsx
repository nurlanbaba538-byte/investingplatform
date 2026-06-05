import KpiCard from '@/components/ui/KpiCard'
import { MANUAL_DATA } from '@/lib/manualData'

type RatesData = {
  dff?: number | null
  sofr?: number | null
  dfii10?: number | null
  t10y2y?: number | null
  t10y3m?: number | null
  dgs10?: number | null
  dgs2?: number | null
  dgs30?: number | null
}
type Props = { apiData?: RatesData | null }

export default function RatePanel({ apiData }: Props) {
  const r = apiData ?? {}
  const { nextFomc } = MANUAL_DATA

  const fmt = (v: number | null | undefined) => v != null ? `${v.toFixed(2)}%` : null

  const yieldRows = [
    { term: 'Fed Funds', yield: fmt(r.dff)   ?? '—', spread: '—',  spreadVal: null },
    { term: '2 İllik',   yield: fmt(r.dgs2)  ?? '—', spread: '—',  spreadVal: null },
    { term: '10 İllik',  yield: fmt(r.dgs10) ?? '—',
      spread: r.t10y2y != null ? `10Y-2Y: ${r.t10y2y > 0 ? '+' : ''}${r.t10y2y.toFixed(2)}%` : '10Y-2Y: —',
      spreadVal: r.t10y2y ?? null },
    { term: '30 İllik',  yield: fmt(r.dgs30) ?? '—',
      spread: r.t10y3m != null ? `10Y-3M: ${r.t10y3m > 0 ? '+' : ''}${r.t10y3m.toFixed(2)}%` : '10Y-3M: —',
      spreadVal: r.t10y3m ?? null },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="FED FUNDS RATE" value={fmt(r.dff)   ?? '5.33%'} source="FRED" colorOverride="amber" verified={r.dff != null} />
        <KpiCard label="SOFR"           value={fmt(r.sofr)  ?? '5.31%'} source="FRED" colorOverride="amber" verified={r.sofr != null} />
        <KpiCard label="10Y REAL FAİZ"  value={fmt(r.dfii10) ?? '2.07%'} source="FRED" colorOverride="amber" verified={r.dfii10 != null} />
        <KpiCard label="NÖVBƏTİ FOMC"  value={nextFomc} source="Manual" colorOverride="neutral" />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['Müddət', 'Gətirilər', 'Kritik Spread'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-ui font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yieldRows.map((row) => (
              <tr key={row.term} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                <td className="px-4 py-2.5 font-ui text-[var(--text-primary)]">{row.term}</td>
                <td className="px-4 py-2.5 font-data text-[var(--text-primary)]">{row.yield}</td>
                <td className={`px-4 py-2.5 font-data ${row.spreadVal !== null ? (row.spreadVal < 0 ? 'text-[var(--red)]' : 'text-[var(--green)]') : 'text-[var(--text-secondary)]'}`}>
                  {row.spread}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
