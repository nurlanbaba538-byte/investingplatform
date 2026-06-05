import KpiCard from '@/components/ui/KpiCard'
import { MANUAL_DATA } from '@/lib/manualData'

type KpiItem  = { value: number | null; change: number | null }
type RatesData = { dgs10?: number|null; dgs2?: number|null; dfii10?: number|null }

type Props = {
  apiData?:   Record<string, KpiItem> | null   // FMP (indekslər) — pulsuz planda boşdur
  ratesData?: RatesData | null                  // FRED (xəzinə, real faiz)
}

const CARDS: Array<{
  label:        string
  key:          keyof typeof MANUAL_DATA.kpi
  source:       string
  fredKey?:     keyof RatesData
  colorOverride?: 'green' | 'red' | 'amber' | 'neutral'
}> = [
  { label: 'S&P 500',        key: 'sp500',       source: 'Manual'                                },
  { label: 'NASDAQ',         key: 'nasdaq',      source: 'Manual'                                },
  { label: 'DOW JONES',      key: 'dowjones',    source: 'Manual'                                },
  { label: '10Y XƏZİNƏ',    key: 'treasury10y', source: 'FRED',  fredKey: 'dgs10',  colorOverride: 'amber' },
  { label: '2Y XƏZİNƏ',     key: 'treasury2y',  source: 'FRED',  fredKey: 'dgs2',   colorOverride: 'amber' },
  { label: 'DXY (DOLLAR)',   key: 'dxy',         source: 'Manual'                                },
  { label: 'VIX (QORXU)',    key: 'vix',         source: 'Manual', colorOverride: 'red'           },
  { label: 'WTI NEFT',       key: 'wti',         source: 'Manual'                                },
  { label: 'BRENT NEFT',     key: 'brent',       source: 'Manual'                                },
  { label: 'QIZIL',          key: 'gold',        source: 'Manual'                                },
  { label: 'BITCOIN',        key: 'bitcoin',     source: 'Manual'                                },
  { label: '10Y REAL FAİZ',  key: 'realRate10y', source: 'FRED',  fredKey: 'dfii10', colorOverride: 'amber' },
]

function fmt(v: number | null, key: string): string | null {
  if (v === null || v === undefined) return null
  if (key === 'bitcoin')                           return v.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (['treasury10y','treasury2y','realRate10y'].includes(key)) return `${v.toFixed(2)}%`
  return v.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export default function QuickSnapshot({ apiData, ratesData }: Props) {
  const fallback = MANUAL_DATA.kpi
  const today = new Date().toLocaleDateString('az-AZ', { day:'numeric', month:'long', timeZone:'Asia/Baku' })

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {CARDS.map(({ label, key, source, fredKey, colorOverride }) => {
        const base = fallback[key]

        // FRED məlumatı (10Y, 2Y, Real Rate)
        if (fredKey && ratesData) {
          const fredVal = ratesData[fredKey]
          const verified = fredVal != null
          return (
            <KpiCard
              key={key}
              label={label}
              value={fmt(fredVal ?? base.value, key)}
              change={base.change}
              source="FRED"
              date={verified ? today : undefined}
              verified={verified}
              colorOverride={colorOverride}
            />
          )
        }

        // FMP indeks (pulsuz planda gəlmir → manualData göstər, badge yox)
        const live    = apiData?.[key]
        const value   = live?.value  ?? base.value
        const change  = live?.change ?? base.change
        const isLive  = live?.value != null

        return (
          <KpiCard
            key={key}
            label={label}
            value={fmt(value, key)}
            change={change}
            source={isLive ? 'FMP' : 'Manual'}
            date={today}
            verified={true}   // manualData həmişə "yoxlanılmış" sayılır
            colorOverride={colorOverride}
          />
        )
      })}
    </div>
  )
}
