import { ReactNode } from 'react'

type DataRowProps = {
  label: string
  value: ReactNode
  accent?: boolean
  mono?: boolean
}

export default function DataRow({ label, value, accent = false, mono = true }: DataRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
      <span className="text-xs text-[var(--text-secondary)] font-ui uppercase tracking-wide">
        {label}
      </span>
      <span className={`text-sm font-medium ${mono ? 'font-data' : 'font-ui'} ${accent ? 'text-[var(--text-accent)]' : 'text-[var(--text-primary)]'}`}>
        {value ?? '—'}
      </span>
    </div>
  )
}
