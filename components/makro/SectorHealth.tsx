import KpiCard from '@/components/ui/KpiCard'

type SectorData = {
  mortgage?: number | null
  housingYoY?: number | null
  hyoas?: number | null
  nfci?: number | null
  altsales?: number | null
}
type Props = { apiData?: SectorData | null }

export default function SectorHealth({ apiData }: Props) {
  const d = apiData ?? {}

  const ITEMS = [
    { label: '30Y İPOTEKA',          value: d.mortgage != null ? `${d.mortgage.toFixed(2)}%` : null,    verified: d.mortgage != null,   colorOverride: (d.mortgage != null && d.mortgage > 7 ? 'red' : 'amber') as 'red' | 'amber' },
    { label: 'CASE-SHILLER İ/İ',     value: d.housingYoY != null ? `${d.housingYoY.toFixed(1)}%` : null, verified: d.housingYoY != null, colorOverride: 'amber' as const },
    { label: 'HY KREDİT SPREADİ',    value: d.hyoas != null ? `${(d.hyoas * 100).toFixed(0)}bp` : null,   verified: d.hyoas != null,      colorOverride: (d.hyoas != null && d.hyoas * 100 > 500 ? 'red' : d.hyoas != null && d.hyoas * 100 > 300 ? 'amber' : 'neutral') as 'red' | 'amber' | 'neutral' },
    { label: 'AVTOMOBIL SATIŞ SAAR', value: d.altsales != null ? `${d.altsales.toFixed(1)}M` : null,      verified: d.altsales != null,   colorOverride: 'neutral' as const },
    { label: 'NFCI (MALİYYƏ ŞƏRT.)', value: d.nfci != null ? d.nfci.toFixed(2) : null,                   verified: d.nfci != null,       colorOverride: 'neutral' as const },
    { label: 'BALTIC DRY İNDEKSİ',   value: null, verified: false, colorOverride: undefined },
    { label: 'BAKER HUGHES RİG',      value: null, verified: false, colorOverride: undefined },
    { label: 'ISM FİYAT ÖDƏNİLƏN',   value: null, verified: false, colorOverride: undefined },
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
