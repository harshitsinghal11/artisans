import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  className?: string
  fullScreen?: boolean
}

export function Spinner({ className = "", fullScreen = false }: SpinnerProps) {
  const spinnerIcon = (
    <Loader2 className={`h-8 w-8 animate-spin text-primary ${className}`} />
  )

  if (fullScreen) {
    return (
      <div className="inset-0 z-50 mt-3 flex items-center justify-center bg-background">
        {spinnerIcon}
      </div>
    )
  }

  return <div className="flex justify-center p-4">{spinnerIcon}</div>
}
