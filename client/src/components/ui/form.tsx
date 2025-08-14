/* =========================================================
   FORM PRIMITIVES (React Hook Form + Radix UI)
   - Drop-in wrappers to build accessible forms consistently
   - Works with react-hook-form Controller/FormProvider
   - Exposes:
       Form, FormField, FormItem, FormLabel, FormControl,
       FormDescription, FormMessage, useFormField
   ========================================================= */

   "use client"

   import * as React from "react"
   import * as LabelPrimitive from "@radix-ui/react-label"
   import { Slot } from "@radix-ui/react-slot"
   import {
     Controller,
     ControllerProps,
     FieldPath,
     FieldValues,
     FormProvider,
     useFormContext,
   } from "react-hook-form"
   
   import { cn } from "@/lib/utils"
   import { Label } from "@/components/ui/label"
   
   /* ---------- Root provider (alias) ---------- */
   const Form = FormProvider
   
   /* =========================================================
      Context: FormField
      - Stores current field name to resolve ids/errors/etc.
      ========================================================= */
   type FormFieldContextValue<
     TFieldValues extends FieldValues = FieldValues,
     TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
   > = {
     name: TName
   }
   
   const FormFieldContext = React.createContext<FormFieldContextValue>(
     {} as FormFieldContextValue
   )
   
   /* ---------- Controller wrapper that provides field name ---------- */
   const FormField = <
     TFieldValues extends FieldValues = FieldValues,
     TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
   >(
     props: ControllerProps<TFieldValues, TName>
   ) => {
     return (
       <FormFieldContext.Provider value={{ name: props.name }}>
         <Controller {...props} />
       </FormFieldContext.Provider>
     )
   }
   
   /* =========================================================
      Context: FormItem
      - Provides a unique id to wire up label, control, help text, message
      ========================================================= */
   type FormItemContextValue = { id: string }
   
   const FormItemContext = React.createContext<FormItemContextValue>(
     {} as FormItemContextValue
   )
   
   /* ---------- Group wrapper for a single field block ---------- */
   const FormItem = React.forwardRef<
     HTMLDivElement,
     React.HTMLAttributes<HTMLDivElement>
   >(({ className, ...props }, ref) => {
     const id = React.useId()
     return (
       <FormItemContext.Provider value={{ id }}>
         <div ref={ref} className={cn("space-y-2", className)} {...props} />
       </FormItemContext.Provider>
     )
   })
   FormItem.displayName = "FormItem"
   
   /* =========================================================
      Hook: useFormField
      - Bridges FormFieldContext + FormItemContext + RHF state
      - Returns ids and error state for the active field
      ========================================================= */
   const useFormField = () => {
     const fieldContext = React.useContext(FormFieldContext)
     const itemContext = React.useContext(FormItemContext)
     const { getFieldState, formState } = useFormContext()
   
     if (!fieldContext) {
       throw new Error("useFormField should be used within <FormField>")
     }
   
     const fieldState = getFieldState(fieldContext.name, formState)
     const { id } = itemContext
   
     return {
       id,
       name: fieldContext.name,
       formItemId: `${id}-form-item`,
       formDescriptionId: `${id}-form-item-description`,
       formMessageId: `${id}-form-item-message`,
       ...fieldState,
     }
   }
   
   /* ---------- Label (binds to control id, styles on error) ---------- */
   const FormLabel = React.forwardRef<
     React.ElementRef<typeof LabelPrimitive.Root>,
     React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
   >(({ className, ...props }, ref) => {
     const { error, formItemId } = useFormField()
     return (
       <Label
         ref={ref}
         htmlFor={formItemId}
         className={cn(error && "text-destructive", className)}
         {...props}
       />
     )
   })
   FormLabel.displayName = "FormLabel"
   
   /* ---------- Control wrapper (sets ids/aria ties) ---------- */
   const FormControl = React.forwardRef<
     React.ElementRef<typeof Slot>,
     React.ComponentPropsWithoutRef<typeof Slot>
   >(({ ...props }, ref) => {
     const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
     return (
       <Slot
         ref={ref}
         id={formItemId}
         aria-describedby={
           !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
         }
         aria-invalid={!!error}
         {...props}
       />
     )
   })
   FormControl.displayName = "FormControl"
   
   /* ---------- Help text / description ---------- */
   const FormDescription = React.forwardRef<
     HTMLParagraphElement,
     React.HTMLAttributes<HTMLParagraphElement>
   >(({ className, ...props }, ref) => {
     const { formDescriptionId } = useFormField()
     return (
       <p
         ref={ref}
         id={formDescriptionId}
         className={cn("text-[0.8rem] text-muted-foreground", className)}
         {...props}
       />
     )
   })
   FormDescription.displayName = "FormDescription"
   
   /* ---------- Error message (auto from RHF state) ---------- */
   const FormMessage = React.forwardRef<
     HTMLParagraphElement,
     React.HTMLAttributes<HTMLParagraphElement>
   >(({ className, children, ...props }, ref) => {
     const { error, formMessageId } = useFormField()
     const body = error ? String(error?.message) : children
   
     if (!body) return null
   
     return (
       <p
         ref={ref}
         id={formMessageId}
         className={cn("text-[0.8rem] font-medium text-destructive", className)}
         {...props}
       >
         {body}
       </p>
     )
   })
   FormMessage.displayName = "FormMessage"
   
   /* ---------- Exports ---------- */
   export {
     useFormField,
     Form,
     FormItem,
     FormLabel,
     FormControl,
     FormDescription,
     FormMessage,
     FormField,
   }
   