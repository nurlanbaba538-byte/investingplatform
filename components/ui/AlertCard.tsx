type AlertCardProps = {
  type: 'risk' | 'opportunity'
  title: string
  body: string
  impact?: string
}

export default function AlertCard({ type, title, body, impact }: AlertCardProps) {
  const isRisk = type === 'risk'

  return (
    <div className={`
      bg-[var(--bg-card)] rounded-lg p-4
      border-l-4 ${isRisk ? 'border-l-[var(--red)]' : 'border-l-[var(--green)]'}
      border border-[var(--border)]
    `}>
      <div className={`text-[10px] uppercase tracking-widest font-bold font-ui mb-1.5 ${isRisk ? 'text-[var(--red)]' : 'text-[var(--green)]'}`}>
        {isRisk ? '⚠ ARTAN RİSK' : '▲ AÇIQ FÜRSƏT'}
      </div>
      <div className="text-sm font-semibold text-[var(--text-primary)] font-ui mb-1">
        {title}
      </div>
      <div className="text-xs text-[var(--text-secondary)] font-ui leading-relaxed">
        {body}
      </div>
      {impact && (
        <div className="mt-2 text-xs font-ui">
          <span className="text-[var(--text-secondary)]">Təsir: </span>
          <span className="text-[var(--text-primary)]">{impact}</span>
        </div>
      )}
    </div>
  )
}
