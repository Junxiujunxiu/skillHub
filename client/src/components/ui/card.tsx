/* =========================================================
   CARD COMPONENTS
   - Reusable UI card elements (container + subcomponents)
   - Includes header, title, description, content, and footer
   - Uses forwardRef for flexibility
   ========================================================= */

   import * as React from "react"
   import { cn } from "@/lib/utils"
   
   /* ---------- CARD CONTAINER ---------- */
   const Card = React.forwardRef<
     HTMLDivElement,
     React.HTMLAttributes<HTMLDivElement>
   >(({ className, ...props }, ref) => (
     <div
       ref={ref}
       className={cn(
         "rounded-xl border bg-card text-card-foreground shadow",
         className
       )}
       {...props}
     />
   ))
   Card.displayName = "Card"
   
   /* ---------- CARD HEADER ---------- */
   const CardHeader = React.forwardRef<
     HTMLDivElement,
     React.HTMLAttributes<HTMLDivElement>
   >(({ className, ...props }, ref) => (
     <div
       ref={ref}
       className={cn("flex flex-col space-y-1.5 p-6", className)}
       {...props}
     />
   ))
   CardHeader.displayName = "CardHeader"
   
   /* ---------- CARD TITLE ---------- */
   const CardTitle = React.forwardRef<
     HTMLDivElement,
     React.HTMLAttributes<HTMLDivElement>
   >(({ className, ...props }, ref) => (
     <div
       ref={ref}
       className={cn("font-semibold leading-none tracking-tight", className)}
       {...props}
     />
   ))
   CardTitle.displayName = "CardTitle"
   
   /* ---------- CARD DESCRIPTION ---------- */
   const CardDescription = React.forwardRef<
     HTMLDivElement,
     React.HTMLAttributes<HTMLDivElement>
   >(({ className, ...props }, ref) => (
     <div
       ref={ref}
       className={cn("text-sm text-muted-foreground", className)}
       {...props}
     />
   ))
   CardDescription.displayName = "CardDescription"
   
   /* ---------- CARD CONTENT ---------- */
   const CardContent = React.forwardRef<
     HTMLDivElement,
     React.HTMLAttributes<HTMLDivElement>
   >(({ className, ...props }, ref) => (
     <div
       ref={ref}
       className={cn("p-6 pt-0", className)}
       {...props}
     />
   ))
   CardContent.displayName = "CardContent"
   
   /* ---------- CARD FOOTER ---------- */
   const CardFooter = React.forwardRef<
     HTMLDivElement,
     React.HTMLAttributes<HTMLDivElement>
   >(({ className, ...props }, ref) => (
     <div
       ref={ref}
       className={cn("flex items-center p-6 pt-0", className)}
       {...props}
     />
   ))
   CardFooter.displayName = "CardFooter"
   
   /* ---------- EXPORTS ---------- */
   export {
     Card,
     CardHeader,
     CardFooter,
     CardTitle,
     CardDescription,
     CardContent
   }
   