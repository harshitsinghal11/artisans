import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-center bg-background px-4 text-center">
      <WifiOff className="mb-4 h-12 w-12 text-muted-foreground" />
      <h2 className="mb-2 text-2xl font-bold text-foreground">You are offline</h2>
      <p className="text-sm text-muted-foreground">
        It looks like you&apos;ve lost your internet connection. We&apos;ll reconnect automatically when you&apos;re back online.
      </p>
    </div>
  )
}
