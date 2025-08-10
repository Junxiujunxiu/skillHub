"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

/**
 * TooltipProvider
 *
 * Wraps your app or a section of it to manage tooltip state globally.
 */
const TooltipProvider = TooltipPrimitive.Provider

/**
 * Tooltip
 *
 * Root component that controls the open/close state of the tooltip.
 */
const Tooltip = TooltipPrimitive.Root

/**
 * TooltipTrigger
 *
 * The element that the user hovers or focuses to trigger the tooltip.
 */
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * TooltipContent
 *
 * The content that appears when the tooltip is triggered.
 * - Accepts `sideOffset` to control spacing from the trigger element.
 * - Supports positioning animations for all sides.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
