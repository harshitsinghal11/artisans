'use client'

import { LogOut, Globe, CircleHelp, User, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/src/hooks/useAuth'
import { createClient } from '@/src/lib/supabase/client'
import { dictionaries, type Language } from '@/src/lib/i18n/dictionaries'
import { readClientLanguage, writeClientLanguage } from '@/src/lib/i18n/client'

export default function MorePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [showLanguages, setShowLanguages] = useState(false)
  const [language, setLanguage] = useState<Language>(() => readClientLanguage())
  const t = dictionaries[language]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const changeLanguage = (nextLanguage: Language) => {
    writeClientLanguage(nextLanguage)
    setLanguage(nextLanguage)
    setShowLanguages(false)
    router.refresh()
  }

  return (
    <div className="mx-auto w-full px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t.menu}</h1>

      <Link href="/profile" className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/40">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t.myProfile}</h2>
            <p className="text-sm text-muted-foreground line-clamp-1">{user?.email ?? 'Signed in user'}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>

      <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
        <button
          type="button"
          onClick={() => setShowLanguages((currentValue) => !currentValue)}
          className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/40"
        >
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">{t.languagePref}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{language === 'hi' ? 'हिंदी' : 'English'}</span>
            <ChevronRight className={`h-4 w-4 transition-transform ${showLanguages ? 'rotate-90' : ''}`} />
          </div>
        </button>

        {showLanguages ? (
          <div className="border-t border-border bg-muted/20 px-4 py-2">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={`rounded-xl p-3 text-left text-sm font-medium ${language === 'en' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                  }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('hi')}
                className={`rounded-xl p-3 text-left text-sm font-medium ${language === 'hi' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                  }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        ) : null}

        <div className="h-px w-full bg-border" />

        <button type="button" className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/40">
          <div className="flex items-center gap-3">
            <CircleHelp className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">{t.helpSupport}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 py-4 font-bold text-destructive transition-colors hover:bg-destructive/20"
      >
        <LogOut className="h-5 w-5" />
        {t.logout}
      </button>
    </div>
  )
}
