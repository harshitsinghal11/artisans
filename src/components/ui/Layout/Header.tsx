'use client'
import { dictionaries, type Language } from '@/src/lib/i18n/dictionaries'
import { usePathname } from 'next/navigation'

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
      <div className="flex h-14 items-center justify-center px-4 relative">
        <span className="font-semibold text-lg text-foreground tracking-tight">{t.appName}</span>
      </div>
    </header>
  )
}
