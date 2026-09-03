'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'
import { Button } from '@/src/components/ui/Button'
import { ROUTES } from '@/src/lib/navigation'
import { Globe, ChevronRight } from 'lucide-react'
import { dictionaries, type Language } from '@/src/lib/i18n/dictionaries'
import { readClientLanguage, writeClientLanguage } from '@/src/lib/i18n/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const t = dictionaries[language]
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setLanguage(readClientLanguage())
  }, [])

  const changeLanguage = (nextLanguage: Language) => {
    writeClientLanguage(nextLanguage)
    setLanguage(nextLanguage)
    setShowLanguages(false)
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(ROUTES.DASHBOARD)}`,
      },
    })

    if (error) {
      console.error('Error logging in:', error.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background px-4 overflow-hidden">
      {/* Top Bar with Language Toggle */}
      <div className="relative pt-6 flex justify-end w-full">
        <div className="relative z-50">
          <button
            type="button"
            onClick={() => setShowLanguages((currentValue) => !currentValue)}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-muted/40 shadow-sm"
          >
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{language === 'hi' ? 'हिंदी' : 'English'}</span>
            <ChevronRight className={`h-4 w-4 transition-transform ${showLanguages ? 'rotate-90' : ''}`} />
          </button>

          {showLanguages && (
            <div className="absolute right-0 top-full mt-2 w-32 rounded-xl border border-border bg-card p-1 shadow-lg">
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${language === 'en' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                  }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('hi')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${language === 'hi' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                  }`}
              >
                हिंदी
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col justify-center pb-20">
        <div className="space-y-4 text-left mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {t.loginHey}<br />{t.loginWelcome}<br />{t.loginApp}
          </h1>
          <p className="text-lg text-muted-foreground font-medium">{t.loginSubtitle}</p>
        </div>

        <Button
          className="w-full h-14 rounded-2xl text-lg font-semibold shadow-md active:scale-[0.98] transition-transform"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? t.loginConnecting : t.loginButton}
        </Button>
      </div>
    </div>
  )
}
