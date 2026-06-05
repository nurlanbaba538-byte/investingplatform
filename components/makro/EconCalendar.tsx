const EVENTS = [
  { time: '11:30', country: 'US', event: 'Həftəlik İlk İşsizlik Müraciəti', forecast: '218K', previous: '222K', impact: 'YÜKSƏK' },
  { time: '11:30', country: 'US', event: 'Davamlı İşsizlik Müraciəti',       forecast: '1,870K', previous: '1,892K', impact: 'ORTA' },
  { time: '13:00', country: 'US', event: 'EIA Xam Neft Ehtiyatları',         forecast: '-1.2M', previous: '+4.5M', impact: 'ORTA' },
  { time: '15:00', country: 'US', event: 'ISM Xidmət PMI',                   forecast: '52.1', previous: '51.6', impact: 'YÜKSƏK' },
  { time: '17:30', country: 'US', event: 'Fed Brard Nitq (Williams)',         forecast: '—', previous: '—', impact: 'ORTA' },
  { time: 'Sabah',  country: 'US', event: 'NFP (Tarım Dışı İstihdam)',        forecast: '185K', previous: '177K', impact: 'YÜKSƏK' },
]

const impactStyle: Record<string, string> = {
  YÜKSƏK: 'bg-[var(--red)] text-white',
  ORTA:   'bg-[var(--amber)] text-[#06080F]',
  AŞAĞI:  'bg-[var(--bg-card-2)] text-[var(--text-secondary)]',
}

export default function EconCalendar() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {['VX (Bakı)', 'Ölkə', 'Hadisə', 'Gözlənti', 'Əvvəlki', 'Təsir'].map((h) => (
              <th key={h} className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-ui font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EVENTS.map((e, i) => (
            <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
              <td className="px-3 py-2.5 font-data text-[var(--text-accent)] whitespace-nowrap">{e.time}</td>
              <td className="px-3 py-2.5 font-ui text-[var(--text-secondary)]">{e.country}</td>
              <td className="px-3 py-2.5 font-ui text-[var(--text-primary)]">{e.event}</td>
              <td className="px-3 py-2.5 font-data text-[var(--text-primary)]">{e.forecast}</td>
              <td className="px-3 py-2.5 font-data text-[var(--text-secondary)]">{e.previous}</td>
              <td className="px-3 py-2.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-ui ${impactStyle[e.impact]}`}>
                  {e.impact}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
