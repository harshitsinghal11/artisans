'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Store, ShoppingBag, Loader2, Building2 } from 'lucide-react'
import { updateUserRole } from '@/src/actions/user'
import { getErrorMessage } from '@/src/lib/errors'

export default function SetupClient() {
  const router = useRouter()
  const [loadingRole, setLoadingRole] = useState<'artisan' | 'customer' | 'b2b' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSelectRole = async (role: 'artisan' | 'customer' | 'b2b') => {
    setLoadingRole(role)
    setError(null)

    try {
      await updateUserRole(role)
      router.push(role === 'artisan' ? '/dashboard' : '/feed')
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to update role'))
      setLoadingRole(null)
    }
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-background px-4 overflow-hidden">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome to Artisans</h1>
          <p className="text-sm text-muted-foreground">
            Select the role that matches how you want to use the platform.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4">
          <button
            type="button"
            onClick={() => handleSelectRole('customer')}
            disabled={loadingRole !== null}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="rounded-full bg-primary/10 p-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">I am a Customer</h2>
              <p className="text-sm text-muted-foreground">
                I want to explore and buy authentic handmade goods.
              </p>
            </div>
            {loadingRole === 'customer' ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : null}
          </button>

          <button
            type="button"
            onClick={() => handleSelectRole('b2b')}
            disabled={loadingRole !== null}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="rounded-full bg-primary/10 p-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">I am a B2B Buyer</h2>
              <p className="text-sm text-muted-foreground">
                I want to place bulk orders and source wholesale authentic goods.
              </p>
            </div>
            {loadingRole === 'b2b' ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : null}
          </button>

          <button
            type="button"
            onClick={() => handleSelectRole('artisan')}
            disabled={loadingRole !== null}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="rounded-full bg-primary/10 p-4">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">I am an Artisan</h2>
              <p className="text-sm text-muted-foreground">
                I want to list and sell my handmade products.
              </p>
            </div>
            {loadingRole === 'artisan' ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : null}
          </button>
        </div>
      </div>
    </div>
  )
}
