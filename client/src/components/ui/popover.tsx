/* =========================================================
   POPOVER COMPONENTS
   - Built on top of Radix UI Popover primitives
   - Provides a lightweight, accessible popup container
   - Includes Trigger, Anchor, and Content components
   ========================================================= */

   "use client"

   import * as React from "react"
   import * as PopoverPrimitive from "@radix-ui/react-popover"
   import { cn } from "@/lib/utils"
   
   /* ===================== ROOT ===================== */
   /**
    * Popover - main container for the popover functionality
    * @example
    *  <Popover>
    *    <PopoverTrigger>Open</PopoverTrigger>
    *    <PopoverContent>Content</PopoverContent>
    *  </Popover>
    */
   const Popover = PopoverPrimitive.Root
   
   /* ===================== TRIGGER ===================== */
   /**
    * PopoverTrigger - element that toggles the popover
    * Can wrap any clickable element.
    */
   const PopoverTrigger = PopoverPrimitive.Trigger
   
   /* ===================== ANCHOR ===================== */
   /**
    * PopoverAnchor - optional anchor to position the popover relative to
    */
   const PopoverAnchor = PopoverPrimitive.Anchor
   
   /* ===================== CONTENT ===================== */
   /**
    * PopoverContent - the panel that displays the popover's contents
    * @param className - additional custom classes
    * @param align - popover alignment relative to the trigger (default: "center")
    * @param sideOffset - offset distance from the trigger (default: 4px)
    */
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
           "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none " +
             "data-[state=open]:animate-in data-[state=closed]:animate-out " +
             "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
             "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 " +
             "data-[side=bottom]:slide-in-from-top-2 " +
             "data-[side=left]:slide-in-from-right-2 " +
             "data-[side=right]:slide-in-from-left-2 " +
             "data-[side=top]:slide-in-from-bottom-2",
           className
         )}
         {...props}
       />
     </PopoverPrimitive.Portal>
   ))
   PopoverContent.displayName = PopoverPrimitive.Content.displayName
   
   /* ===================== EXPORTS ===================== */
   export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
   