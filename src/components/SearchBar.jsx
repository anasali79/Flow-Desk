import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery, selectSearchQuery } from '../store/taskSlice'

const SearchBar = () => {
  const dispatch = useDispatch()
  const searchQuery = useSelector(selectSearchQuery)

  return (
    <div className="mb-6">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        placeholder="Search tasks by title..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>
  )
}

export default SearchBar

