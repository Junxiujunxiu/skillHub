"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

/**
 * Switch Component
 * 
 * A toggle switch built with Radix UI's Switch primitives.
 * 
 * Features:
 * - Supports `checked` and `unchecked` visual states.
 * - Fully keyboard accessible.
 * - Styled with Tailwind CSS and customizable via `className`.
 * 
 * Props:
 * - className: Additional Tailwind CSS classes to extend/override styling.
 * - ...props: Any other props supported by Radix UI's Switch.Root.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    /* 
      Root Switch Element:
      - peer → allows styling of child elements based on state.
      - inline-flex, h-5, w-9 → size & layout.
      - rounded-full → fully rounded edges.
      - border-2 border-transparent → removes default border but keeps spacing.
      - transition-colors → smooth background color change.
      - focus-visible:ring → accessibility focus outline.
      - disabled:cursor-not-allowed, disabled:opacity-50 → disabled state styling.
      - State-based colors:
          * checked: bg-primary / bg-primary-700
          * unchecked: bg-input / bg-customgreys-dirtyGrey
    */
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      "data-[state=checked]:bg-primary-700",
      "data-[state=unchecked]:bg-customgreys-dirtyGrey",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      /* 
        Switch Handle (Thumb):
        - pointer-events-none → prevents direct pointer events on thumb.
        - block h-4 w-4 → size.
        - rounded-full → circle shape.
        - bg-background → base color.
        - shadow-lg → depth effect.
        - transition-transform → smooth slide movement.
        - State-based transform:
            * checked: translate-x-4
            * unchecked: translate-x-0
        - Additional color override: bg-gray-100
      */
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        "bg-gray-100"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
