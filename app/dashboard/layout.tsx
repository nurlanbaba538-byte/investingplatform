'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard/makro',       label: 'MAKRO ANALİZ' },
  { href: '/dashboard/bazar',       label: 'BAZAR ANALİZİ' },
  { href: '/dashboard/fundamental', label: 'FUNDAMENTAL ANALİZ' },
  { href: '/dashboard/texniki',     label: 'TEXNİKİ ANALİZ' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      {/* Nav bar */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-card)] border-b border-[var(--border)]">
        <div className="max-w-screen-2xl mx-auto px-6 flex items-center gap-8 h-12">
          {/* Logo */}
          <span className="font-data text-sm text-[var(--text-accent)] shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--green-bright)] inline-block" />
            PLATFORM
          </span>

          {/* Tabs — desktop */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-3 py-1 text-[11px] font-semibold uppercase tracking-wider font-ui
                    transition-colors duration-150
                    ${active
                      ? 'text-[var(--text-accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--text-accent)] rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Tabs — mobile (aşağı tab bar üçün spacer) */}
          <div className="md:hidden flex-1" />
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card)] border-t border-[var(--border)] flex">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          const short = item.label.split(' ')[0]
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 py-2 text-center text-[10px] font-semibold uppercase tracking-wider font-ui transition-colors
                ${active ? 'text-[var(--text-accent)]' : 'text-[var(--text-secondary)]'}`}
            >
              {short}
              {active && <div className="h-[2px] bg-[var(--text-accent)] rounded-full mt-0.5 mx-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Page content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-6 pb-16 md:pb-6">
        {children}
      </main>
    </div>
  )
}
