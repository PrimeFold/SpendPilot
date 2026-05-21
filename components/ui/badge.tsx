import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary"
}

const badgeVariants = {
  default: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.15em] uppercase",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge }
