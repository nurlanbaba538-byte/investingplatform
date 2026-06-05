type VerifiedTagProps = {
  source?: string
  date?: string
  rawValue?: string | number
  verified?: boolean
}

export default function VerifiedTag({ source, date, rawValue, verified = true }: VerifiedTagProps) {
  if (!verified) {
    return (
      <span className="text-[10px] italic text-[var(--amber)] font-ui">
        yoxlanılmadı
      </span>
    )
  }

  const parts = [source, date, rawValue !== undefined ? String(rawValue) : undefined].filter(Boolean)

  return (
    <span className="text-[10px] text-[var(--text-mono)] font-ui">
      {parts.join(' · ')}
    </span>
  )
}
