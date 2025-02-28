import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "wn-relative wn-flex wn-w-full wn-touch-none wn-select-none wn-items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="wn-relative wn-h-1.5 wn-w-full wn-grow wn-overflow-hidden wn-rounded-full wn-bg-primary/20">
      <SliderPrimitive.Range className="wn-absolute wn-h-full wn-bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="wn-block wn-h-4 wn-w-4 wn-rounded-full wn-border wn-border-primary/50 wn-bg-background wn-shadow wn-transition-colors focus-visible:wn-outline-none focus-visible:wn-ring-1 focus-visible:wn-ring-ring disabled:wn-pointer-events-none disabled:wn-opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider } 