import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Sidebar = ({ activePage = 'dashboard' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/login')
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsOpen(false) // Close sidebar on mobile after navigation
  }

  const isActive = (page) => {
    if (page === 'dashboard') return location.pathname === '/dashboard'
    if (page === 'tasks') return location.pathname === '/tasks'
    return false
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 shadow-sm flex flex-col border-r border-gray-100 dark:border-gray-700 z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-sm">FD</span>
        </div>
        <span className="text-black dark:text-white font-semibold text-lg">FlowDesk</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <div className="space-y-1">
          {/* Dashboard */}
          <div
            onClick={() => handleNavigation('/dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors relative ${
              isActive('dashboard')
                ? 'bg-yellow-50 dark:bg-yellow-900/30'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {isActive('dashboard') && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-r"></div>
            )}
            <svg className={`w-5 h-5 ${isActive('dashboard') ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className={isActive('dashboard') ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-600 dark:text-gray-300'}>Dashboard</span>
          </div>

          {/* My tasks */}
          <div
            onClick={() => handleNavigation('/tasks')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors relative ${
              isActive('tasks')
                ? 'bg-yellow-50 dark:bg-yellow-900/30'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {isActive('tasks') && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-r"></div>
            )}
            <svg className={`w-5 h-5 ${isActive('tasks') ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={isActive('tasks') ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-600 dark:text-gray-300'}>My tasks</span>
          </div>


        </div>
      </nav>

      {/* Bottom Links */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-1">

        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log out</span>
        </div>
      </div>
      </div>
    </>
  )
}

export default Sidebar

