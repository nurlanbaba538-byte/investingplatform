import KpiCard from '@/components/ui/KpiCard'
import { MANUAL_DATA } from '@/lib/manualData'

type LaborData = {
  unrate?: number | null
  icsa?: number | null
  jtsjol?: number | null
  hourlyYoY?: number | null
  umcsent?: number | null
  retailYoY?: number | null
}
type Props = { apiData?: LaborData | null }

export default function LaborPanel({ apiData }: Props) {
  const d = apiData ?? {}
  const { nextNfp } = MANUAL_DATA

  const ITEMS = [
    { label: 'İŞSİZLİK FAİZİ',      value: d.unrate != null ? `${d.unrate.toFixed(1)}%` : null,    verified: d.unrate != null,    colorOverride: 'neutral' as const },
    { label: 'İLK MÜRACİƏT',         value: d.icsa != null ? `${(d.icsa / 1000).toFixed(0)}K` : null, verified: d.icsa != null,   colorOverride: 'neutral' as const },
    { label: 'NÖVBƏTİ NFP',          value: nextNfp,                                                   verified: true,              colorOverride: 'neutral' as const },
    { label: 'JOLTS AÇIQ İŞ',        value: d.jtsjol != null ? `${(d.jtsjol / 1000).toFixed(2)}M` : null,    verified: d.jtsjol != null, colorOverride: 'neutral' as const },
    { label: 'SAATLIK QAZANC İ/İ',   value: d.hourlyYoY != null ? `${d.hourlyYoY.toFixed(1)}%` : null, verified: d.hourlyYoY != null, colorOverride: 'neutral' as const },
    { label: 'MİCHİGAN İSTEHLAKÇI',  value: d.umcsent != null ? d.umcsent.toFixed(1) : null,           verified: d.umcsent != null,   colorOverride: (d.umcsent != null && d.umcsent < 50 ? 'red' : 'neutral') as 'red' | 'neutral' },
    { label: 'PƏRAKƏNDƏ SATIŞ İ/İ',  value: d.retailYoY != null ? `${d.retailYoY.toFixed(1)}%` : null, verified: d.retailYoY != null, colorOverride: undefined },
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
