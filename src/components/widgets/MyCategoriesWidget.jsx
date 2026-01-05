import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectAllTasks, setFilters, setFilter, setSearchQuery } from '../../store/taskSlice'

const MyCategoriesWidget = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tasks = useSelector(selectAllTasks)

  // Build categories dynamically from task.team
  const categories = useMemo(() => {
    const map = new Map()
    tasks.forEach((task) => {
      const team = task.team || 'General'
      if (!map.has(team)) {
        map.set(team, {
          id: team,
          name: team,
          icon: '📋',
          count: 0,
        })
      }
      map.get(team).count += 1
    })
    return Array.from(map.values())
  }, [tasks])

  const handleCategoryClick = (team) => {
    // Clear search and status filter, set team filter, go to tasks page
    dispatch(setSearchQuery(''))
    dispatch(setFilter('all'))
    dispatch(setFilters({ team }))
    navigate('/tasks')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">My categories</h3>
        <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
            />
          </svg>
        </button>
      </div>

      {/* Categories */}
      <div className="flex-1 -mx-4">
        {categories.map((category, index) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className={`flex items-center justify-between px-4 py-3 gap-4 ${
              index === 0 ? '' : 'border-t border-gray-200 dark:border-gray-700'
            } ${
              index === categories.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
            } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
                <span>{category.icon}</span>
              </div>
              <span className="text-sm text-gray-800 dark:text-gray-200">{category.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {category.count}
            </span>
          </div>
        ))}
      </div>

     
    </div>
  )
}

export default MyCategoriesWidget

