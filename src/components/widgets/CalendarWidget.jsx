import { useState } from 'react'

const CalendarWidget = () => {
  // Start from current month/year
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
    
    const days = []
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const days = getDaysInMonth(currentDate)
  const todayDate = new Date()
  const isCurrentMonth =
    todayDate.getFullYear() === currentDate.getFullYear() &&
    todayDate.getMonth() === currentDate.getMonth()
  const today = isCurrentMonth ? todayDate.getDate() : null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Days of week header */}
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`text-center text-sm py-2 rounded-lg ${
              day === today && day !== null
                ? 'bg-yellow-400 text-black font-semibold'
                : day
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                : 'text-transparent'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarWidget

