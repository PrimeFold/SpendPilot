import * as React from "react"
import { cn } from "@/lib/utils"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
