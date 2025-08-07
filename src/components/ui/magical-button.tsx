import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const magicalButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        magical: "bg-magical text-primary-foreground font-display font-semibold magic-glow hover:scale-105 transition-all duration-300 animate-pulse-glow",
        fire: "bg-fire text-primary-foreground font-display font-semibold fire-glow hover:scale-105 transition-all duration-300",
        parchment: "bg-parchment text-primary font-elegant font-medium border-2 border-amber-600 hover:bg-parchment-dark transition-all duration-300 shadow-lg",
        goblet: "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-amber-900 font-display font-bold border-2 border-amber-800 gold-glow hover:scale-110 transition-all duration-300 animate-pulse-glow relative overflow-hidden",
        nav: "bg-background/80 backdrop-blur-sm text-foreground font-body font-medium border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200",
        code: "bg-slate-800 text-slate-100 font-mono text-sm border border-slate-600 hover:bg-slate-700 transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface MagicalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof magicalButtonVariants> {
  asChild?: boolean
}

const MagicalButton = React.forwardRef<HTMLButtonElement, MagicalButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(magicalButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
MagicalButton.displayName = "MagicalButton"

export { MagicalButton, magicalButtonVariants }