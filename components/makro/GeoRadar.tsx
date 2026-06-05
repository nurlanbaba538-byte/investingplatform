import AlertCard from '@/components/ui/AlertCard'
import { MANUAL_DATA } from '@/lib/manualData'

const { risks, opportunities, geopolitics } = MANUAL_DATA

const priorityStyle: Record<string, string> = {
  YÜKSƏK: 'bg-[var(--red)] text-white',
  ORTA:   'bg-[var(--amber)] text-[#06080F]',
  AŞAĞI:  'bg-[var(--bg-card-2)] text-[var(--text-secondary)]',
}

export default function GeoRadar() {
  return (
    <div className="space-y-6">

      {/* Risk / Fürsət kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {risks.map((r, i) => (
          <AlertCard key={i} type={r.type} title={r.title} body={r.body} impact={r.impact} />
        ))}
        {opportunities.map((o, i) => (
          <AlertCard key={i} type={o.type} title={o.title} body={o.body} impact={o.impact} />
        ))}
      </div>

      {/* Geopolitik Radar */}
      <div className="space-y-2">
        {geopolitics.map((item, i) => (
          <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 flex gap-4">
            <span className={`shrink-0 self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-ui ${priorityStyle[item.priority]}`}>
              {item.priority}
            </span>
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] font-ui">{item.title}</p>
              <p className="text-xs text-[var(--text-secondary)] font-ui leading-relaxed">{item.body}</p>
              {item.impact && (
                <p className="text-xs font-ui">
                  <span className="text-[var(--text-secondary)]">Təsir: </span>
                  <span className="text-[var(--text-primary)]">{item.impact}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
