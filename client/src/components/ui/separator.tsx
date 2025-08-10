/* =========================================================
   SEPARATOR COMPONENT
   - Built on Radix UI Separator primitive
   - Used to visually divide content either horizontally or vertically
   ========================================================= */

   "use client"

   import * as React from "react"
   import * as SeparatorPrimitive from "@radix-ui/react-separator"
   import { cn } from "@/lib/utils"
   
   /**
    * Separator component
    * - `orientation` can be "horizontal" (default) or "vertical"
    * - `decorative` determines whether the separator is purely visual (default: true)
    * - Supports custom styling via `className`
    */
   const Separator = React.forwardRef<
     React.ElementRef<typeof SeparatorPrimitive.Root>,
     React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
   >(
     (
       { className, orientation = "horizontal", decorative = true, ...props },
       ref
     ) => (
       <SeparatorPrimitive.Root
         ref={ref}
         decorative={decorative}
         orientation={orientation}
         className={cn(
           "shrink-0 bg-border", // Base style
           orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", // Size based on orientation
           className
         )}
         {...props}
       />
     )
   )
   Separator.displayName = SeparatorPrimitive.Root.displayName
   
   export { Separator }
   