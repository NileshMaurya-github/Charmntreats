import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer rounded-xl bg-gradient-to-r from-pink-100/50 via-rose-100/80 to-pink-100/50 bg-[length:200%_100%]", className)}
      {...props}
    />
  )
}

export { Skeleton }
