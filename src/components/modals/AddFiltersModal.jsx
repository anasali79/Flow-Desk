import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, selectAllTasks } from '../../store/taskSlice'

const AddFiltersModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const tasks = useSelector(selectAllTasks)
  const [activeFilter, setActiveFilter] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState({
    project: null,
    deadline: null,
    type: null,
  })

  const filterOptions = {
    project: [...new Set(tasks.map(t => t.project).filter(Boolean))],
    deadline: ['Today', 'Tomorrow', 'This week', 'Wednesday', 'Friday'],
    type: [...new Set(tasks.map(t => t.type).filter(Boolean))],
  }

  const handleFilterSelect = (filterType, value) => {
    const newFilters = { ...selectedFilters, [filterType]: value }
    setSelectedFilters(newFilters)
    dispatch(setFilters(newFilters))
  }

  const filterButtons = [
    { type: 'project', label: 'Project', icon: '📄' },
    { type: 'deadline', label: 'Deadline', icon: '🕐' },
    { type: 'type', label: 'Type', icon: '📋' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl shadow-xl p-4 sm:p-6 lg:p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add filters</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-8">
          {filterButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => setActiveFilter(activeFilter === btn.type ? null : btn.type)}
              className={`flex-1 px-6 py-4 rounded-lg border-2 transition-colors ${
                activeFilter === btn.type
                  ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{btn.icon}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{btn.label}</div>
            </button>
          ))}
        </div>

        {/* Filter Options */}
        {activeFilter && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tasks</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filterOptions[activeFilter]?.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleFilterSelect(activeFilter, option)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFilters[activeFilter] === option
                      ? 'bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedFilters[activeFilter] === option
                        ? 'bg-yellow-400 border-yellow-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedFilters[activeFilter] === option && (
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Search */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium">Advanced search</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddFiltersModal

