import { cn } from "@/lib/utils"

/**
 * Skeleton Component
 * 
 * This component displays a placeholder skeleton UI while content is loading.
 * It applies a pulsing animation to indicate ongoing activity.
 * 
 * Props:
 * - className: Additional Tailwind classes to override or extend styles.
 * - ...props: Any other valid HTML div attributes.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      /* 
        Purpose: Creates a skeleton loading effect.
        Styles:
          - animate-pulse → pulsing animation for loading indication.
          - rounded-md → rounded corners for smooth shape.
          - bg-primary/10 & bg-gray-700 → base background color.
        Customization:
          - Accepts additional classes via className prop.
      */
      className={cn(
        "animate-pulse rounded-md bg-primary/10",
        "bg-gray-700",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
