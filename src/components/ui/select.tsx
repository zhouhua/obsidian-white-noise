import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown, ChevronUp, Check } from "lucide-react"

import { cn } from "../../lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "wn-flex wn-h-6 wn-w-full wn-items-center wn-justify-between wn-whitespace-nowrap wn-rounded-md wn-border wn-border-input wn-bg-transparent wn-p-1 wn-text-xs wn-shadow-sm wn-ring-offset-background wn-placeholder:wn-text-muted-foreground wn-focus:wn-outline-none wn-focus:wn-ring-1 wn-focus:wn-ring-ring disabled:wn-cursor-not-allowed disabled:wn-opacity-50 [&>span]:wn-line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="wn-h-4 wn-w-4 wn-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "wn-flex wn-cursor-default wn-items-center wn-justify-center wn-py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="wn-h-4 wn-w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "wn-flex wn-cursor-default wn-items-center wn-justify-center wn-py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="wn-h-4 wn-w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "wn-relative wn-z-50 wn-max-h-96 wn-min-w-[8rem] wn-overflow-hidden wn-rounded-md wn-border wn-bg-popover wn-text-popover-foreground wn-shadow-md data-[state=open]:wn-animate-in data-[state=closed]:wn-animate-out data-[state=closed]:wn-fade-out-0 data-[state=open]:wn-fade-in-0 data-[state=closed]:wn-zoom-out-95 data-[state=open]:wn-zoom-in-95 data-[side=bottom]:wn-slide-in-from-top-2 data-[side=left]:wn-slide-in-from-right-2 data-[side=right]:wn-slide-in-from-left-2 data-[side=top]:wn-slide-in-from-bottom-2",
        position === "popper" &&
        "data-[side=bottom]:wn-translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:wn-translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "wn-p-1",
          position === "popper" &&
          "wn-h-[var(--radix-select-trigger-height)] wn-full wn-min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("wn-px-1 wn-py-1 wn-text-xs wn-font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "wn-relative wn-flex wn-w-full wn-cursor-default wn-select-none wn-items-center wn-rounded-sm wn-py-1 wn-pl-2 wn-pr-8 wn-text-xs wn-outline-none wn-focus:wn-bg-accent wn-focus:wn-text-accent-foreground data-[disabled]:wn-pointer-events-none data-[disabled]:wn-opacity-50",
      className
    )}
    {...props}
  >
    <span className="wn-absolute wn-right-2 wn-flex wn-h-3.5 wn-w-3.5 wn-items-center wn-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="wn-h-4 wn-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("wn-mx-1 wn-my-1 wn-h-px wn-bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} 