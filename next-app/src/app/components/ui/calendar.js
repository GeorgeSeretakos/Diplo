"use client"

import { useState } from "react"
import { Button } from "./button"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const Calendar = ({ selected, onSelect, className = "" }) => {
  const [currentDate, setCurrentDate] = useState(selected || new Date())

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onSelect(newDate)
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selected && selected.getDate() === day && selected.getMonth() === month && selected.getFullYear() === year

      days.push(
        <Button
          key={day}
          onClick={() => handleDateClick(day)}
          variant={isSelected ? "default" : "ghost"}
          className={`w-8 h-8 p-0 font-normal ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
        >
          {day}
        </Button>,
      )
    }

    return days
  }

  return (
    <div className={`p-3 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevMonth} variant="ghost" className="h-7 w-7 p-0">
          <span className="sr-only">Previous month</span>
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
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </Button>
        <div className="font-semibold">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <Button onClick={handleNextMonth} variant="ghost" className="h-7 w-7 p-0">
          <span className="sr-only">Next month</span>
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
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
    </div>
  )
}

export { Calendar }

