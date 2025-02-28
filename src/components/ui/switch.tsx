"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "../../lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "wn-peer wn-inline-flex wn-h-5 wn-w-9 wn-shrink-0 wn-cursor-pointer wn-items-center wn-rounded-full wn-border-2 wn-border-transparent wn-transition-colors focus-visible:wn-outline-none focus-visible:wn-ring-2 focus-visible:wn-ring-ring focus-visible:wn-ring-offset-2 focus-visible:wn-ring-offset-background disabled:wn-cursor-not-allowed disabled:wn-opacity-50 data-[state=checked]:wn-bg-primary data-[state=unchecked]:wn-bg-input wn-p-0",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "wn-pointer-events-none wn-block wn-h-4 wn-w-4 wn-rounded-full wn-bg-background wn-shadow-lg wn-ring-0 wn-transition-transform data-[state=checked]:wn-translate-x-4 data-[state=unchecked]:wn-translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
