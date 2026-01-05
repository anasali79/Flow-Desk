import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery } from '../store/taskSlice'
import { toggleTheme, selectTheme } from '../store/themeSlice'
import AddTaskModal from './modals/AddTaskModal'
import { useNavigate } from 'react-router-dom'

const Header = ({ onNewTask, title = 'Dashboard overview' }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useSelector(selectTheme)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleNewTaskClick = () => {
    if (onNewTask) {
      onNewTask()
    } else {
      setShowTaskModal(true)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Left Side */}
      <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate">{title}</h1>
        <div className="relative hidden md:block">
          <input
            type="text"
            value={searchValue}
            placeholder="Search"
            onChange={(e) => {
              const value = e.target.value
              setSearchValue(value)
              dispatch(setSearchQuery(value))
            }}
            className="pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 dark:text-white"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
        {/* Mobile Search */}
        <div className="relative md:hidden flex-1">
          <input
            type="text"
            value={searchValue}
            placeholder="Search"
            onChange={(e) => {
              const value = e.target.value
              setSearchValue(value)
              dispatch(setSearchQuery(value))
            }}
            className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 dark:text-white"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* New Task Button */}
        <button
          onClick={handleNewTaskClick}
          className="bg-yellow-400 hover:bg-yellow-500 text-black dark:text-gray-900 font-medium px-3 sm:px-4 py-2 rounded-full flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New task</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </button>

      </div>

      {/* Task Modal */}
      {showTaskModal && <AddTaskModal onClose={() => setShowTaskModal(false)} />}
    </div>
  )
}

export default Header

