'use client'

import { useEffect } from 'react'
import { Button } from '@/src/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
      <h2 className="mb-2 text-2xl font-bold text-foreground">Something went wrong!</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        We encountered an unexpected error. Please try again or check your connection.
      </p>
      <Button onClick={() => reset()} className="w-full max-w-xs h-12">
        Try again
      </Button>
    </div>
  )
}
