type Props = {
  message?: string
  type?: 'warn' | 'error'
}

export default function ErrorBanner({ message, type = 'warn' }: Props) {
  const isError = type === 'error'
  return (
    <div className={`flex items-start gap-3 rounded-lg p-3 border text-xs font-ui ${
      isError
        ? 'bg-[var(--bg-card)] border-[var(--red)] text-[var(--red)]'
        : 'bg-[var(--bg-card)] border-[var(--amber)] text-[var(--amber)]'
    }`}>
      <span className="shrink-0 text-sm">{isError ? '⚠' : '⚠'}</span>
      <p>{message ?? (isError ? 'Xəta baş verdi. Yenidən cəhd edin.' : 'Məlumat əldə edilə bilmədi — manual data göstərilir.')}</p>
    </div>
  )
}
