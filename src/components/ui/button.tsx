import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 text-white hover:from-pink-700 hover:via-rose-600 hover:to-pink-800 shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transform hover:scale-[1.02] hover:-translate-y-0.5",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:shadow-red-500/25 transform hover:scale-[1.02]",
        outline:
          "border-2 border-pink-300 bg-white/80 backdrop-blur-sm text-pink-700 hover:bg-pink-50 hover:border-pink-400 hover:text-pink-800 shadow-md hover:shadow-lg transform hover:scale-[1.02]",
        secondary:
          "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]",
        ghost: "text-slate-700 hover:bg-pink-50 hover:text-pink-700 rounded-lg transition-all duration-300",
        link: "text-pink-600 underline-offset-4 hover:underline hover:text-pink-700 transition-colors duration-300",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-13 rounded-xl px-10 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
