'use client'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  if (pathname.startsWith('/auth') || pathname.startsWith('/setup')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-14 items-center justify-center px-4 relative">
        <span className="font-semibold text-lg text-foreground tracking-tight">Kavlya</span>
      </div>
    </header>
  )
}
