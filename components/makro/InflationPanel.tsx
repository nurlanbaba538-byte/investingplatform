import KpiCard from '@/components/ui/KpiCard'

type InflationData = {
  cpiYoY?: number | null
  coreCpiYoY?: number | null
  pceYoY?: number | null
  ppiYoY?: number | null
  gdpnow?: number | null
  t5yifr?: number | null
  t10yie?: number | null
  walcl?: number | null
}
type Props = { apiData?: InflationData | null }

function pct(v: number | null | undefined, decimals = 1) {
  return v != null ? `${v.toFixed(decimals)}%` : null
}

export default function InflationPanel({ apiData }: Props) {
  const d = apiData ?? {}

  const ITEMS = [
    { label: 'MANŞET CPI İ/İ',    value: pct(d.cpiYoY),     verified: d.cpiYoY != null,     colorOverride: 'amber' as const  },
    { label: 'ÇƏKİRDƏK CPI İ/İ', value: pct(d.coreCpiYoY), verified: d.coreCpiYoY != null,  colorOverride: 'amber' as const  },
    { label: 'ÇƏKİRDƏK PCE İ/İ', value: pct(d.pceYoY),     verified: d.pceYoY != null,      colorOverride: 'amber' as const  },
    { label: 'PPI İ/İ',           value: pct(d.ppiYoY),     verified: d.ppiYoY != null,      colorOverride: 'neutral' as const },
    { label: 'ATLANTA GDPNow',    value: pct(d.gdpnow, 1),  verified: d.gdpnow != null,      colorOverride: 'neutral' as const },
    { label: '5Y5Y FORWARD',      value: pct(d.t5yifr, 2),  verified: d.t5yifr != null,      colorOverride: 'neutral' as const },
    { label: '10Y BREAKEVEN',     value: pct(d.t10yie, 2),  verified: d.t10yie != null,      colorOverride: 'neutral' as const },
    { label: 'FED BALANSI',       value: d.walcl != null ? `$${(d.walcl / 1000).toFixed(1)}T` : null,
      verified: d.walcl != null, colorOverride: undefined },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {ITEMS.map((item) => (
        <KpiCard
          key={item.label}
          label={item.label}
          value={item.value}
          source="FRED"
          verified={item.verified}
          colorOverride={item.colorOverride}
        />
      ))}
    </div>
  )
}
