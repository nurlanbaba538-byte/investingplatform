import { type ScoredStock, type RiskLabel } from '@/lib/fundamental'
import StatusPill from '@/components/ui/StatusPill'

type Props = { stocks: ScoredStock[] }

const riskVariant: Record<RiskLabel, 'green' | 'amber' | 'red' | 'neutral'> = {
  'KONSERVATİV': 'green',
  'BALANCED':    'amber',
  'HIGH_RISK':   'red',
  'ÇIXART':      'neutral',
}

function fmt(v: number | null, multiply100 = false, decimals = 1): string {
  if (v == null) return '—'
  const val = multiply100 ? v * 100 : v
  return val.toFixed(decimals)
}

export default function ScoreTable({ stocks }: Props) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-x-auto">
      <table className="w-full text-xs min-w-[900px]">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {['#', 'Ticker', 'Şirkət', 'Bal/150', 'ROIC%', 'FCF_Y%', 'RevGr%', 'EPS5%', 'IntCov', 'PEG', 'Risk'].map(h => (
              <th key={h} className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-ui font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s, i) => (
            <tr key={s.ticker || i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
              <td className="px-3 py-2.5 font-data text-[var(--text-secondary)]">{i + 1}</td>
              <td className="px-3 py-2.5 font-data text-[var(--text-accent)] font-semibold">{s.ticker || '—'}</td>
              <td className="px-3 py-2.5 font-ui text-[var(--text-secondary)] max-w-[140px] truncate">{s.name || '—'}</td>
              <td className="px-3 py-2.5">
                <span className={`font-data font-bold text-sm ${
                  s.total >= 100 ? 'text-[var(--green-bright)]' :
                  s.total >= 80  ? 'text-[var(--green)]' :
                  s.total >= 60  ? 'text-[var(--amber)]' : 'text-[var(--red)]'
                }`}>{s.total}</span>
                <span className="text-[var(--text-secondary)] font-ui">/150</span>
              </td>
              <td className={`px-3 py-2.5 font-data ${s.ROIC != null && s.ROIC > 0.15 ? 'text-[var(--green)]' : 'text-[var(--text-secondary)]'}`}>
                {fmt(s.ROIC, true)}%
              </td>
              <td className={`px-3 py-2.5 font-data ${s.FCF_Y != null && s.FCF_Y > 0.03 ? 'text-[var(--green)]' : 'text-[var(--text-secondary)]'}`}>
                {fmt(s.FCF_Y, true)}%
              </td>
              <td className={`px-3 py-2.5 font-data ${s.RevGr != null ? (s.RevGr > 0.15 ? 'text-[var(--green)]' : s.RevGr < 0 ? 'text-[var(--red)]' : 'text-[var(--text-secondary)]') : 'text-[var(--text-secondary)]'}`}>
                {fmt(s.RevGr, true)}%
              </td>
              <td className={`px-3 py-2.5 font-data ${s.EPS5 != null && s.EPS5 > 0.20 ? 'text-[var(--green)]' : 'text-[var(--text-secondary)]'}`}>
                {fmt(s.EPS5, true)}%
              </td>
              <td className={`px-3 py-2.5 font-data ${s.IntCov != null ? (s.IntCov > 8 ? 'text-[var(--green)]' : s.IntCov < 1.5 ? 'text-[var(--red)]' : 'text-[var(--amber)]') : 'text-[var(--text-secondary)]'}`}>
                {fmt(s.IntCov, false, 1)}
              </td>
              <td className={`px-3 py-2.5 font-data ${s.PEG != null && s.PEG > 0 && s.PEG < 1.2 ? 'text-[var(--green)]' : 'text-[var(--text-secondary)]'}`}>
                {fmt(s.PEG, false, 2)}
              </td>
              <td className="px-3 py-2.5">
                <StatusPill label={s.riskLabel} variant={riskVariant[s.riskLabel]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
