import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "../../lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "wn-inline-flex wn-h-9 wn-items-center wn-justify-center wn-rounded-lg wn-bg-muted wn-p-1 wn-text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "wn-inline-flex wn-items-center wn-justify-center wn-whitespace-nowrap wn-rounded-md wn-px-3 wn-py-1 wn-text-sm wn-font-medium wn-ring-offset-background wn-transition-all focus-visible:wn-outline-none focus-visible:wn-ring-2 focus-visible:wn-ring-ring focus-visible:wn-ring-offset-2 disabled:wn-pointer-events-none disabled:wn-opacity-50 data-[state=active]:wn-bg-background data-[state=active]:wn-text-foreground data-[state=active]:wn-shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "wn-mt-2 wn-ring-offset-background focus-visible:wn-outline-none focus-visible:wn-ring-2 focus-visible:wn-ring-ring focus-visible:wn-ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent } 