import Link from 'next/link'
import { Store } from 'lucide-react'
import { ROUTES } from '@/src/lib/navigation'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-center px-4 relative">
        <Link href={ROUTES.DASHBOARD} className="absolute left-4 flex items-center justify-center h-full">
          <Store className="h-6 w-6 text-primary" />
        </Link>
        <span className="font-semibold text-lg text-foreground tracking-tight">Artisans</span>
      </div>
    </header>
  )
}
