/* =========================================================
   LABEL COMPONENT
   - A styled wrapper around Radix UI's LabelPrimitive.Root
   - Uses class-variance-authority (CVA) for consistent variants
   - Accessible label for form inputs, respecting peer-disabled state
   ========================================================= */

   "use client"

   import * as React from "react"
   import * as LabelPrimitive from "@radix-ui/react-label"
   import { cva, type VariantProps } from "class-variance-authority"
   
   import { cn } from "@/lib/utils"
   
   /**
    * Variants for the Label component using CVA
    * - Handles base styles and disabled states
    */
   const labelVariants = cva(
     "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
   )
   
   /**
    * Label Component
    * @param className Additional CSS classes to merge
    * @param props     Standard Radix Label props
    * @example
    *  <Label htmlFor="username">Username</Label>
    */
   const Label = React.forwardRef<
     React.ElementRef<typeof LabelPrimitive.Root>,
     React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
       VariantProps<typeof labelVariants>
   >(({ className, ...props }, ref) => (
     <LabelPrimitive.Root
       ref={ref}
       className={cn(labelVariants(), className)}
       {...props}
     />
   ))
   
   Label.displayName = LabelPrimitive.Root.displayName
   
   export { Label }
   