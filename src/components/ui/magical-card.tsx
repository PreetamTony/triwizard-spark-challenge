import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const magicalCardVariants = cva(
  "rounded-lg text-card-foreground shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card border",
        magical: "bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-magic-blue/30 magic-glow",
        parchment: "bg-parchment border-2 border-amber-600 shadow-xl",
        scroll: "bg-gradient-to-b from-parchment to-parchment-dark border-2 border-amber-700 rounded-none relative before:content-[''] before:absolute before:-top-2 before:-left-2 before:w-4 before:h-4 before:bg-amber-800 before:rounded-full after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-4 after:h-4 after:bg-amber-800 after:rounded-full",
        floating: "bg-card/90 backdrop-blur-md border border-magic-purple/40 shadow-2xl animate-float",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const MagicalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof magicalCardVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(magicalCardVariants({ variant, className }))}
    {...props}
  />
))
MagicalCard.displayName = "MagicalCard"

const MagicalCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
MagicalCardHeader.displayName = "MagicalCardHeader"

const MagicalCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-display font-bold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
MagicalCardTitle.displayName = "MagicalCardTitle"

const MagicalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground font-body", className)}
    {...props}
  />
))
MagicalCardDescription.displayName = "MagicalCardDescription"

const MagicalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
MagicalCardContent.displayName = "MagicalCardContent"

const MagicalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
MagicalCardFooter.displayName = "MagicalCardFooter"

export {
  MagicalCard,
  MagicalCardHeader,
  MagicalCardFooter,
  MagicalCardTitle,
  MagicalCardDescription,
  MagicalCardContent,
}