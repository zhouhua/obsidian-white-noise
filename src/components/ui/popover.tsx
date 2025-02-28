"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "wn-z-50 wn-w-72 wn-rounded-md wn-border wn-bg-popover wn-p-4 wn-text-popover-foreground wn-shadow-md wn-outline-none data-[state=open]:wn-animate-in data-[state=closed]:wn-animate-out data-[state=closed]:wn-fade-out-0 data-[state=open]:wn-fade-in-0 data-[state=closed]:wn-zoom-out-95 data-[state=open]:wn-zoom-in-95 data-[side=bottom]:wn-slide-in-from-top-2 data-[side=left]:wn-slide-in-from-right-2 data-[side=right]:wn-slide-in-from-left-2 data-[side=top]:wn-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent } 