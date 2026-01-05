import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTask } from '../store/taskSlice'

const AddTask = () => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    setError('')
    dispatch(addTask(title.trim()))
    setTitle('')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Add New Task
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError('')
            }}
            placeholder="Enter task title..."
            className={`w-full px-4 py-3 rounded-lg border ${
              error
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Task
        </button>
      </form>
    </div>
  )
}

export default AddTask

