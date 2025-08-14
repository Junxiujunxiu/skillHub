/* =========================================================
   INPUT COMPONENT
   - A styled <input> element with Tailwind classes
   - Supports file inputs and standard text-based inputs
   - Inherits all native input props
   - Fully accessible with focus styles & disabled state
   ========================================================= */

   import * as React from "react"
   import { cn } from "@/lib/utils"
   
   /**
    * Input
    * @param className  Optional extra classes to merge with defaults
    * @param type       Input type (text, password, file, etc.)
    * @param props      Any other standard input attributes
    */
   const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
     ({ className, type, ...props }, ref) => {
       return (
         <input
           type={type}
           ref={ref}
           className={cn(
             // Layout & sizing
             "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
             // File input styles
             "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
             // Placeholder styles
             "placeholder:text-muted-foreground",
             // Focus state
             "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
             // Disabled state
             "disabled:cursor-not-allowed disabled:opacity-50",
             // Responsive text size
             "md:text-sm",
             className
           )}
           {...props}
         />
       )
     }
   )
   Input.displayName = "Input"
   
   export { Input }
   