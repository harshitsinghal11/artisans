'use client'

import { useState } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { Button } from '@/src/components/ui/Button'
import { ROUTES } from '@/src/lib/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

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
    <div className="flex min-h-[100svh] items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-sm flex-col justify-center space-y-8 rounded-2xl border border-border bg-card p-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome</h1>
          <p className="text-muted-foreground">Sign in to manage your artisanal catalog</p>
        </div>

        <Button
          className="w-full h-14 text-lg font-medium"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Sign in with Google'}
        </Button>
      </div>
    </div>
  )
}
