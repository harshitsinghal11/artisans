import { Loader2 } from 'lucide-react'

interface LoaderProps {
  className?: string
  fullScreen?: boolean
}

export function Loader({ className = "", fullScreen = false }: LoaderProps) {
  const loaderIcon = <Loader2 className={`h-8 w-8 animate-spin text-primary ${className}`} />

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90">
        {loaderIcon}
      </div>
    )
  }

  return loaderIcon
}
