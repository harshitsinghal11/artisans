'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BOTTOM_NAV_ITEMS } from '@/src/lib/navigation'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t border-border bg-background pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          // Exact match for dashboard home, otherwise prefix match for sub-routes
          const isActive = item.href === '/dashboard' 
            ? pathname === item.href 
            : pathname.startsWith(item.href)
            
          const Icon = item.icon
          
          if (item.isPrimary) {
            return (
              <div key={item.href} className="relative -top-4">
                <Link 
                  href={item.href}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
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
              className={`flex flex-col items-center justify-center space-y-1 w-16 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
