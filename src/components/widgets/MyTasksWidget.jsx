import { useSelector, useDispatch } from 'react-redux'
import { selectFilteredTasks, updateTask } from '../../store/taskSlice'

const MyTasksWidget = () => {
  const tasks = useSelector(selectFilteredTasks)
  const dispatch = useDispatch()

  const handleToggleTask = (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    dispatch(updateTask({ id: task.id, updates: { status: newStatus } }))
  }

  const getDueLabel = (task) => {
    // Prefer explicit dueDate field from task data (e.g. 'Today', 'Tomorrow', 'This week' or ISO date)
    const raw = task.dueDate

    if (!raw) return 'Later'

    // If it's one of our known labels, just return as‑is
    if (raw === 'Today' || raw === 'Tomorrow' || raw === 'This week') {
      return raw
    }

    // Otherwise treat as date string and compare with today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const taskDate = new Date(raw)
    if (isNaN(taskDate.getTime())) return 'Later'
    taskDate.setHours(0, 0, 0, 0)

    const diffTime = taskDate.getTime() - today.getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays >= 2 && diffDays <= 7) return 'This week'
    return 'Later'
  }

  const sortKeyForTask = (task) => {
    const label = getDueLabel(task)

    // Order: Today (0), Tomorrow (1), This week (2), Later (3)
    switch (label) {
      case 'Today':
        return 0
      case 'Tomorrow':
        return 1
      case 'This week':
        return 2
      default:
        return 3
    }
  }

  // Sample tasks matching the image - use actual tasks if available, otherwise use defaults
  const defaultTasks = [
    { id: 1, title: 'Finish monthly reporting', status: 'completed', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 2, title: 'Contract signing', status: 'pending', createdAt: new Date().toISOString() },
    { id: 3, title: 'Market overview keyno...', status: 'pending', createdAt: new Date(Date.now() + 86400000).toISOString() },
    { id: 4, title: 'Project research', status: 'pending', createdAt: new Date(Date.now() + 86400000).toISOString() },
    { id: 5, title: 'Prepare invoices', status: 'pending', createdAt: new Date(Date.now() + 7 * 86400000).toISOString() },
  ]
  
  const displayTasks =
    tasks.length > 0
      ? [...tasks]
          .sort((a, b) => sortKeyForTask(a) - sortKeyForTask(b))
          .slice(0, 5)
      : defaultTasks

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
        My tasks ({displayTasks.length})
      </h3>
      <div className="flex-1 -mx-6">
        {displayTasks.map((task, index) => {
          const dueLabel = getDueLabel(task)
          const getDueLabelColor = (label) => {
            if (label === 'Today') {
              return 'text-orange-600 dark:text-orange-400'
            }
            return 'text-gray-500 dark:text-gray-400'
          }
          
          return (
            <div
              key={task.id}
              className={`flex items-center gap-4 py-4 px-6 ${
                index === 0 ? '' : 'border-t border-gray-200 dark:border-gray-700'
              } ${
                index === displayTasks.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
              } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
            >
              <button
                onClick={() => handleToggleTask(task)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  task.status === 'completed'
                    ? 'bg-yellow-400 border-yellow-400 dark:bg-yellow-400 dark:border-yellow-400'
                    : 'border-gray-300 dark:border-gray-600 hover:border-yellow-400'
                }`}
              >
                {task.status === 'completed' && (
                  <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-base truncate ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                  {task.title}
                </p>
              </div>
              <span className={`text-sm flex-shrink-0 ${getDueLabelColor(dueLabel)}`}>{dueLabel}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyTasksWidget

