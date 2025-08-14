import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Textarea Component
 *
 * A reusable styled <textarea> element with forwardRef support.
 * - Supports custom className merging.
 * - Inherits HTML textarea props.
 * - Fully styled with focus, disabled, and placeholder states.
 *
 * Example:
 * <Textarea placeholder="Type your message..." rows={4} />
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
