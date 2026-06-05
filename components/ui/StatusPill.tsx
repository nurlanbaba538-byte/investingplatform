type StatusPillVariant = 'green' | 'amber' | 'red' | 'stage1' | 'stage2' | 'stage3' | 'stage4' | 'blue' | 'neutral'

type StatusPillProps = {
  label: string
  variant: StatusPillVariant
}

const solidStyles: Record<string, string> = {
  green:   'bg-[var(--green)] text-[#06080F]',
  amber:   'bg-[var(--amber)] text-[#06080F]',
  red:     'bg-[var(--red)] text-white',
  blue:    'bg-[var(--blue)] text-white',
  neutral: 'bg-[var(--bg-card-2)] text-[var(--text-secondary)]',
}

const outlinedStyles: Record<string, string> = {
  stage1: 'border border-[var(--stage-1)] text-[var(--stage-1)]',
  stage2: 'border border-[var(--stage-2)] text-[var(--stage-2)]',
  stage3: 'border border-[var(--stage-3)] text-[var(--stage-3)]',
  stage4: 'border border-[var(--stage-4)] text-[var(--stage-4)]',
}

export default function StatusPill({ label, variant }: StatusPillProps) {
  const isSolid = variant in solidStyles
  const cls = isSolid ? solidStyles[variant] : outlinedStyles[variant] ?? outlinedStyles.stage1

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-ui ${cls}`}>
      {label}
    </span>
  )
}
