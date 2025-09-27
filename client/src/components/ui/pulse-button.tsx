import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const pulseButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95 hover:scale-105 hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-destructive/25",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-secondary/25",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      pulse: {
        none: "",
        subtle: "hover:animate-pulse",
        active: "animate-pulse",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      pulse: "none",
    },
  }
)

export interface PulseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pulseButtonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const PulseButton = React.forwardRef<HTMLButtonElement, PulseButtonProps>(
  ({ className, variant, size, pulse, asChild = false, loading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          pulseButtonVariants({ variant, size, pulse: loading ? "active" : pulse, className }),
          loading && "relative overflow-hidden"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-current/10 backdrop-blur-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText && <span className="ml-2 text-xs">{loadingText}</span>}
          </div>
        )}
        <span className={cn("transition-opacity", loading && "opacity-50")}>
          {children}
        </span>
      </Comp>
    )
  }
)
PulseButton.displayName = "PulseButton"

export { PulseButton, pulseButtonVariants }