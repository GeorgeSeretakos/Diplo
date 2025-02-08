"use client"

import React, { useState } from "react"

const Popover = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "PopoverTrigger") {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) })
        }
        if (child.type.displayName === "PopoverContent") {
          return isOpen ? child : null
        }
        return child
      })}
    </div>
  )
}

const PopoverTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={className} {...props} />
))
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
    {...props}
  />
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }

