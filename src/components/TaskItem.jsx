import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteTask, updateTask } from '../store/taskSlice'
import EditTask from './EditTask'

const TaskItem = ({ task }) => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id))
    }
  }

  const handleToggleStatus = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    // When status changes, also update stage appropriately
    let newStage = task.stage;
    if (newStatus === 'completed') {
      newStage = 'Completed';
    } else if (newStatus === 'pending' && task.stage === 'Completed') {
      newStage = 'In progress';
    }
    dispatch(updateTask({ id: task.id, updates: { status: newStatus, stage: newStage } }));
  }

  const handleUpdateStage = (newStage) => {
    // When stage changes, also update status appropriately
    let newStatus = task.status;
    if (newStage === 'Completed') {
      newStatus = 'completed';
    } else if (newStage === 'Not started' || newStage === 'In progress') {
      newStatus = 'pending';
    }
    dispatch(updateTask({ id: task.id, updates: { stage: newStage, status: newStatus } }));
  }

  if (isEditing) {
    return (
      <EditTask
        task={task}
        onCancel={() => setIsEditing(false)}
        onSave={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold mb-2 ${
              task.status === 'completed'
                ? 'line-through text-gray-500 dark:text-gray-400'
                : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {task.title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                task.status === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}
            >
              {task.status === 'completed' ? 'Completed' : 'Pending'}
            </span>
            <div className="relative">
              <select
                value={task.stage || 'Not started'}
                onChange={(e) => handleUpdateStage(e.target.value)}
                className="text-xs px-2 py-1 rounded border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              task.status === 'completed'
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskItem

