import React from "react"

const Button = React.forwardRef(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  return (
    <Comp
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        variant === "default"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : variant === "outline"
            ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            : ""
      } ${
        size === "default"
          ? "h-10 px-4 py-2"
          : size === "sm"
            ? "h-9 rounded-md px-3"
            : size === "lg"
              ? "h-11 rounded-md px-8"
              : ""
      } ${className}`}
      ref={ref}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button }

