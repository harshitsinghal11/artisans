'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BOTTOM_NAV_ITEMS } from '@/src/lib/navigation'
import { dictionaries, type Language } from '@/src/lib/i18n/dictionaries'

interface BottomNavProps {
  role?: 'artisan' | 'customer' | null
  lang: Language
}

const navLabels = {
  Home: 'home',
  Catalog: 'catalog',
  Add: 'add',
  Feed: 'feed',
  More: 'more',
} as const

export function BottomNav({ role, lang }: BottomNavProps) {
  const pathname = usePathname()
  const t = dictionaries[lang]

  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/setup') ||
    pathname.startsWith('/dashboard/review')
  ) {
    return null
  }

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t border-border bg-background">
      <div className="flex h-16 items-center justify-around px-2">
        {BOTTOM_NAV_ITEMS.filter((item) => {
          if (role === 'customer') {
            return item.href === '/feed' || item.href === '/more'
          }

          return true
        }).map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === item.href
              : pathname.startsWith(item.href)

          const Icon = item.icon

          if (item.isPrimary) {
            return (
              <div key={item.href} className="relative -top-4">
                <Link
                  href={item.href}
                  aria-label={t.add}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                >
                  <Icon className="h-7 w-7" />
                </Link>
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-full w-16 flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-[10px] font-medium">
                {t[navLabels[item.label as keyof typeof navLabels]]}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
