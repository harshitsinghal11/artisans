import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    let classes = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 "
    
    if (variant === "default") classes += "bg-primary text-primary-foreground hover:bg-primary/90 "
    else if (variant === "secondary") classes += "bg-secondary text-secondary-foreground hover:bg-secondary/80 "
    else if (variant === "outline") classes += "border border-border bg-background hover:bg-muted hover:text-foreground "
    else if (variant === "ghost") classes += "hover:bg-muted hover:text-foreground "

    if (size === "default") classes += "h-10 px-4 py-2 "
    else if (size === "sm") classes += "h-9 px-3 "
    else if (size === "lg") classes += "h-11 px-8 "

    return (
      <button
        ref={ref}
        className={classes + className}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
