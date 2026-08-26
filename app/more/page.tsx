'use client'

import { createClient } from '@/src/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Globe, CircleHelp, User, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function MorePage() {
  const router = useRouter()
  const [showLanguages, setShowLanguages] = useState(false)
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    // Read initial language from cookie
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'))
    if (match) {
      setLanguage(match[2] as 'en' | 'hi')
    }
    const fetchUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (data.user?.email) setEmail(data.user.email)
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const changeLanguage = (lang: 'en' | 'hi') => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`
    setLanguage(lang)
    setShowLanguages(false)
    window.location.reload()
  }

  // Very simple client-side translation for this specific page
  // Server pages use the server dictionary.
  const t = language === 'hi' ? {
    menu: 'मेनू',
    email: 'ईमेल',
    profile: 'मेरी प्रोफ़ाइल',
    langPref: 'भाषा',
    help: 'मदद और समर्थन',
    logout: 'लॉग आउट',
    currentLang: 'हिंदी (Hindi)'
  } : {
    menu: 'Menu',
    email: 'Email',
    profile: 'My Profile',
    langPref: 'Language Preference',
    help: 'Help & Support',
    logout: 'Log Out',
    currentLang: 'English'
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-24 max-w-md">
      <h1 className="text-2xl font-bold text-foreground mb-6">{t.menu}</h1>

      {/* Profile Card */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground text-lg">{t.profile}</h2>
          <p className="text-sm text-muted-foreground line-clamp-1">{email}</p>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
        <div>
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{t.langPref}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {t.currentLang} <ChevronRight className={`w-4 h-4 transition-transform ${showLanguages ? 'rotate-90' : ''}`} />
            </div>
          </button>

          {showLanguages && (
            <div className="bg-muted/30 px-4 py-2 border-t border-border flex flex-col">
              <button
                onClick={() => changeLanguage('en')}
                className={`text-left p-3 rounded-lg text-sm font-medium ${language === 'en' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`text-left p-3 rounded-lg text-sm font-medium ${language === 'hi' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          )}
        </div>

        <div className="h-[1px] w-full bg-border" />

        <button className="w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
          <div className="flex items-center gap-3">
            <CircleHelp className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">{t.help}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        className="w-full bg-destructive/10 text-destructive font-bold py-4 rounded-2xl transition-colors hover:bg-destructive/20 flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        {t.logout}
      </button>
    </div>
  )
}
