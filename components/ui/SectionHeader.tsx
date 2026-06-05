type SectionHeaderProps = {
  number: string
  title: string
}

export default function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px w-6 bg-[var(--border)]" />
      <span className="text-xs uppercase tracking-widest font-semibold font-ui whitespace-nowrap">
        <span className="text-[var(--text-accent)]">{number}</span>
        <span className="text-[var(--text-secondary)]"> · </span>
        <span className="text-[var(--text-primary)]">{title}</span>
      </span>
      <div className="h-px flex-1 bg-[var(--border)]" />
    </div>
  )
}
