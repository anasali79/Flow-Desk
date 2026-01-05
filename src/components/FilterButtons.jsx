import { useDispatch, useSelector } from 'react-redux'
import { setFilter, selectFilter, clearFilters, setSearchQuery, selectSearchQuery } from '../store/taskSlice'

const FilterButtons = () => {
  const dispatch = useDispatch()
  const currentFilter = useSelector(selectFilter)
  const currentSearchQuery = useSelector(selectSearchQuery)

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ]

  const handleClearFilters = () => {
    dispatch(setFilter('all'));
    dispatch(clearFilters());
    dispatch(setSearchQuery(''));
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => dispatch(setFilter(filter.value))}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            currentFilter === filter.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {filter.label}
        </button>
      ))}

    </div>
  )
}

export default FilterButtons

