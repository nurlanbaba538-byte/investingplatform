type Props = { className?: string }

export function SkeletonBox({ className = '' }: Props) {
  return (
    <div className={`bg-[var(--bg-card-2)] rounded animate-pulse ${className}`} />
  )
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 space-y-3">
      <SkeletonBox className="h-2.5 w-20" />
      <SkeletonBox className="h-7 w-28" />
      <SkeletonBox className="h-2 w-14" />
      <SkeletonBox className="h-2 w-16" />
    </div>
  )
}

export function KpiGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }, (_, i) => <KpiCardSkeleton key={i} />)}
    </div>
  )
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-[var(--border)]">
      {Array.from({ length: cols }, (_, i) => (
        <td key={i} className="px-3 py-3">
          <SkeletonBox className="h-2.5 w-16" />
        </td>
      ))}
    </tr>
  )
}

export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 space-y-2">
          <SkeletonBox className="h-2.5 w-32" />
          <SkeletonBox className="h-2 w-48" />
          <SkeletonBox className="h-2 w-40" />
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-10 pb-12 pt-2 animate-pulse">
      <div className="space-y-2">
        <SkeletonBox className="h-2.5 w-48" />
        <SkeletonBox className="h-6 w-80" />
        <SkeletonBox className="h-2 w-36" />
      </div>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] border-l-4 border-l-[var(--bg-card-2)] rounded-lg p-5 space-y-2">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-5/6" />
      </div>
      <KpiGridSkeleton count={12} />
      <KpiGridSkeleton count={8} />
      <KpiGridSkeleton count={7} />
    </div>
  )
}
