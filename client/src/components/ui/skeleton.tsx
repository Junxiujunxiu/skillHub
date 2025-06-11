import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
    // This component is used to create a skeleton loading effect
      className={cn("animate-pulse rounded-md bg-primary/10", "bg-gray-700", className)}
      {...props}
    />
  )
}

export { Skeleton }
