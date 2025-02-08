"use client"

import React, { useState } from "react"

const Select = React.forwardRef(({ children, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(null)

  return (
    <div className="relative" ref={ref} {...props}>
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "SelectTrigger") {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            selectedValue: selectedValue,
          })
        }
        if (child.type.displayName === "SelectContent") {
          return isOpen
            ? React.cloneElement(child, {
              onValueChange: (value) => {
                setSelectedValue(value)
                setIsOpen(false)
              },
            })
            : null
        }
        return child
      })}
    </div>
  )
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef(({ className, children, selectedValue, ...props }, ref) => (
  <button
    ref={ref}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {selectedValue || children}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 opacity-50"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef(({ className, children, onValueChange, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className}`}
    {...props}
  >
    <div className="p-1">{React.Children.map(children, (child) => React.cloneElement(child, { onValueChange }))}</div>
  </div>
))
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, onValueChange, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
    onClick={() => onValueChange(children)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
    <span className="truncate">{children}</span>
  </div>
))
SelectItem.displayName = "SelectItem"

const SelectValue = React.forwardRef(({ className, ...props }, ref) => (
  <span ref={ref} className={`${className}`} {...props} />
))
SelectValue.displayName = "SelectValue"

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }

