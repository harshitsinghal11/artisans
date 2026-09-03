'use client'
import { dictionaries, type Language } from '@/src/lib/i18n/dictionaries'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, ShoppingCart } from 'lucide-react'

interface HeaderProps {
  lang: Language
}

export function Header({ lang }: HeaderProps) {
  const pathname = usePathname()
  const t = dictionaries[lang]
  if (pathname.startsWith('/auth') || pathname.startsWith('/setup')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="font-semibold text-lg text-foreground tracking-tight">{t.appName}</span>
        <div className="flex items-center gap-4">
          <Link href="/profile" className="text-foreground transition-colors hover:text-primary">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="text-foreground transition-colors hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
