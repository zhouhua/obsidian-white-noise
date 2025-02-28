import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "wn:inline-flex wn:items-center wn:justify-center wn:whitespace-nowrap wn:rounded-md wn:text-sm wn:font-medium wn:transition-colors wn:focus-visible:outline-none wn:focus-visible:ring-1 wn:focus-visible:ring-ring wn:disabled:pointer-events-none wn:disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "wn:bg-primary wn:text-primary-foreground wn:shadow wn:hover:wn:bg-primary/90",
        destructive:
          "wn:bg-destructive wn:text-destructive-foreground wn:shadow-sm wn:hover:wn:bg-destructive/90",
        outline:
          "wn:border wn:border-input wn:bg-transparent wn:shadow-sm wn:hover:wn:bg-accent wn:hover:wn:text-accent-foreground",
        secondary:
          "wn:bg-secondary wn:text-secondary-foreground wn:shadow-sm wn:hover:wn:bg-secondary/80",
        ghost: "wn:hover:wn:bg-accent wn:hover:wn:text-accent-foreground",
        link: "wn:text-primary wn:underline-offset-4 wn:hover:wn:underline",
      },
      size: {
        default: "wn:h-9 wn:px-4 wn:py-2",
        sm: "wn:h-8 wn:rounded-md wn:px-3 wn:text-xs",
        lg: "wn:h-10 wn:rounded-md wn:px-8",
        icon: "wn:h-9 wn:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 