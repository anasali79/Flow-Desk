import { useSelector } from 'react-redux'
import { selectFilteredTasks, selectTasksLoading, selectTasksError } from '../store/taskSlice'
import TaskItem from './TaskItem'

const TaskList = () => {
  const tasks = useSelector(selectFilteredTasks)
  const loading = useSelector(selectTasksLoading)
  const error = useSelector(selectTasksError)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading tasks...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          No tasks found. Add a new task to get started!
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}

export default TaskList

