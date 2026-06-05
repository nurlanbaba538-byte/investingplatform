import KpiCard from '@/components/ui/KpiCard'

type EarningsData = {
  reportedPct: number
  beatRate: number
  surpriseMagnitude: number
  blendedGrowth: number
  forwardPE: number
  q2Forecast: number
  q3Forecast: number
  q4Forecast: number
  cyForecast: number
  factsetBeatRate: number
  lsegBeatRate: number
  factsetGrowth: number
  lsegGrowth: number
}

type Props = { data: EarningsData }

export default function EarningsPanel({ data }: Props) {
  const forecasts = [
    { period: 'Q2 2026', value: data.q2Forecast },
    { period: 'Q3 2026', value: data.q3Forecast },
    { period: 'Q4 2026', value: data.q4Forecast },
    { period: 'İllik CY', value: data.cyForecast },
  ]

  return (
    <div className="space-y-4">
      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard label="HESABAT FAİZİ"    value={`${data.reportedPct}%`}        colorOverride="neutral" />
        <KpiCard label="UYĞUNLUQ DƏRƏCƏSİ" value={`${data.beatRate}%`}         colorOverride={data.beatRate > 75 ? 'green' : 'amber'} />
        <KpiCard label="SÜRPRİZ BÖYÜKLÜİ" value={`+${data.surpriseMagnitude}%`} colorOverride="green" />
        <KpiCard label="BİRLƏŞİK BÖYÜMƏ"  value={`+${data.blendedGrowth}%`}    colorOverride="green" />
        <KpiCard label="FORWARD P/E"       value={data.forwardPE.toFixed(1)}    colorOverride={data.forwardPE > 22 ? 'amber' : 'neutral'} />
      </div>

      {/* Forward forecasts */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 divide-x divide-[var(--border)]">
          {forecasts.map((f) => (
            <div key={f.period} className="p-3 text-center">
              <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] font-ui mb-1">{f.period}</p>
              <p className="text-lg font-bold font-data text-[var(--green)]">+{f.value}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dual source */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-ui font-semibold">FactSet</p>
          <div className="flex justify-between text-xs font-ui">
            <span className="text-[var(--text-secondary)]">Beat Rate</span>
            <span className="font-data text-[var(--green)]">{data.factsetBeatRate}%</span>
          </div>
          <div className="flex justify-between text-xs font-ui">
            <span className="text-[var(--text-secondary)]">EPS Böyümə</span>
            <span className="font-data text-[var(--green)]">+{data.factsetGrowth}%</span>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-ui font-semibold">LSEG</p>
          <div className="flex justify-between text-xs font-ui">
            <span className="text-[var(--text-secondary)]">Beat Rate</span>
            <span className="font-data text-[var(--green)]">{data.lsegBeatRate}%</span>
          </div>
          <div className="flex justify-between text-xs font-ui">
            <span className="text-[var(--text-secondary)]">EPS Böyümə</span>
            <span className="font-data text-[var(--green)]">+{data.lsegGrowth}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
