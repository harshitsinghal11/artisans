'use client'

import Link from 'next/link'
import { Store } from 'lucide-react'
import { ROUTES } from '@/src/lib/navigation'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  if (pathname.startsWith('/auth')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-center px-4 relative">
        <Link href={ROUTES.DASHBOARD} className="absolute left-4 flex items-center justify-center h-full">
          <Store className="h-6 w-6 text-primary" />
        </Link>
        <span className="font-semibold text-lg text-foreground tracking-tight">Artisans</span>
      </div>
    </header>
  )
}
