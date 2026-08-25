'use client'

import { useState } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { Button } from '@/src/components/ui/button'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      console.error('Error logging in:', error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8 bg-card p-8 rounded-2xl shadow-lg border border-border text-center">
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
