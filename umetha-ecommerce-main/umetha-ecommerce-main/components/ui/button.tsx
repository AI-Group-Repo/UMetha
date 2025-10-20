
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-indigo-500 to-blue-400 text-white shadow-md shadow-indigo-600/20 hover:shadow-lg hover:from-indigo-600/95 hover:to-violet-600/95 focus-visible:ring-indigo-500",
        destructive: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20 hover:shadow-lg hover:from-red-600/95 hover:to-rose-600/95 focus-visible:ring-red-500",
        outline: "border border-indigo-200 dark:border-violet-800/50 bg-white/80 dark:bg-black/20 text-indigo-700 dark:text-violet-300 hover:bg-indigo-50 dark:hover:bg-violet-900/30 hover:border-indigo-300 dark:hover:border-violet-700 focus-visible:ring-indigo-500",
        secondary: "bg-indigo-100 dark:bg-violet-900/40 text-indigo-700 dark:text-violet-300 hover:bg-indigo-200 dark:hover:bg-violet-900/60 focus-visible:ring-indigo-500",
        ghost: "text-indigo-700 dark:text-violet-300 hover:bg-indigo-50 dark:hover:bg-violet-900/30 focus-visible:ring-indigo-500",
        link: "text-indigo-600 dark:text-violet-400 underline-offset-4 hover:text-indigo-700 dark:hover:text-violet-300 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-11 px-8 py-2 text-base",
        icon: "h-10 w-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
// ...existing code...

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
