import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border-2 border-pink-200/50 bg-white/80 backdrop-blur-sm px-4 py-3 text-base ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/20 focus-visible:ring-offset-2 focus-visible:border-pink-400 hover:border-pink-300 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 font-medium shadow-sm hover:shadow-md focus:shadow-lg resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }