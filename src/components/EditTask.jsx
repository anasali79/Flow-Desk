import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateTask } from '../store/taskSlice'

const EditTask = ({ task, onCancel, onSave }) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState(task.title || task.name || '')
  const [stage, setStage] = useState(task.stage || 'Not started')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    setError('')
    // When stage is updated, also update status appropriately
    let newStatus = task.status;
    if (stage === 'Completed') {
      newStatus = 'completed';
    } else if (stage === 'Not started' || stage === 'In progress') {
      newStatus = 'pending';
    }
    dispatch(updateTask({ id: task.id, updates: { title: title.trim(), name: title.trim(), stage, status: newStatus } }))
    onSave()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError('')
            }}
            placeholder="Enter task title"
            className={`w-full px-4 py-2 rounded-lg border ${
              error
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
            autoFocus
          />
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTask

