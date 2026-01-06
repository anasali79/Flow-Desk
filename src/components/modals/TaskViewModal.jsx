import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectSelectedTask,
  updateTask,
  deleteTask
} from '../../store/taskSlice'
import {
  fetchComments,
  addComment,
  selectAllComments
} from '../../store/commentSlice'

const TaskViewModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const task = useSelector(selectSelectedTask)
  const allComments = useSelector(selectAllComments)

  const [newComment, setNewComment] = useState('')

  const comments = allComments.filter(c => c.taskId === task?.id)

  const [updatedTask, setUpdatedTask] = useState({
    title: '',
    stage: 'Not started',
    priority: 'Medium',
    dueDate: 'Today',
    type: 'Report',
    project: '',
    team: '',
    description: '',
    status: 'pending'
  })

  useEffect(() => {
    if (!task) return
    dispatch(fetchComments(task.id))
    setUpdatedTask({
      title: task.title,
      stage: task.stage || 'Not started',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || 'Today',
      type: task.type || 'Report',
      project: task.project || '',
      team: task.team || '',
      description: task.description || '',
      status: task.status || 'pending'
    })
  }, [task, dispatch])

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    await dispatch(
      addComment({
        taskId: task.id,
        text: newComment,
        author: 'You',
        createdAt: new Date().toISOString()
      })
    )
    setNewComment('')
  }

  const handleSave = async () => {
    await dispatch(updateTask({ id: task.id, updates: updatedTask }))
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(task.id))
      onClose()
    }
  }

  const toggleStatus = () => {
    const status = updatedTask.status === 'completed' ? 'pending' : 'completed'
    setUpdatedTask({
      ...updatedTask,
      status,
      stage: status === 'completed' ? 'Completed' : 'In progress'
    })
  }

  useEffect(() => {
    // Add overflow-hidden to body when modal opens
    document.body.classList.add('overflow-hidden')
    
    // Cleanup function to remove overflow-hidden when modal closes
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  if (!task) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="
          bg-white dark:bg-gray-800
          w-full h-full md:h-auto md:max-h-[90vh]
          lg:max-w-5xl
          mx-auto
          flex flex-col lg:flex-row
          rounded-none lg:rounded-xl
          relative
          overflow-hidden
          md:h-fit md:w-fit md:rounded-xl
        "
      >
        {/* LEFT PANEL */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-220px)] md:max-h-[70vh] lg:max-h-[60vh]">
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 relative">
            <div className="flex gap-3 items-start">
              <button
                onClick={toggleStatus}
                className={`w-5 h-5 mt-2 rounded-full border-2 flex items-center justify-center ${
                  updatedTask.status === 'completed'
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-400 dark:border-gray-500'
                }`}
              >
                {updatedTask.status === 'completed' && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>

              <input
                value={updatedTask.title}
                onChange={e =>
                  setUpdatedTask({ ...updatedTask, title: e.target.value })
                }
                className={`text-xl md:text-2xl font-bold bg-transparent focus:outline-none w-full p-1 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 rounded ${
                  updatedTask.status === 'completed'
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-gray-800 dark:text-white'
                }`}
              />
            </div>

            <button 
              onClick={onClose}
              className="text-2xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Description */}
          <textarea
            value={updatedTask.description}
            onChange={e =>
              setUpdatedTask({ ...updatedTask, description: e.target.value })
            }
            placeholder="Add description..."
            className="w-full bg-transparent text-gray-600 dark:text-gray-300 focus:outline-none mb-6 resize-none border border-gray-300 dark:border-gray-600 rounded-lg p-3"
            rows={4}
          />

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={updatedTask.priority}
              onChange={e =>
                setUpdatedTask({ ...updatedTask, priority: e.target.value })
              }
              className="px-3 py-1 rounded-full bg-yellow-400 text-black"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              value={updatedTask.stage}
              onChange={e =>
                setUpdatedTask({ ...updatedTask, stage: e.target.value })
              }
              className="px-3 py-1 rounded-full bg-gray-200"
            >
              <option>Not started</option>
              <option>In progress</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green-500 px-4 py-2 rounded-full text-white"
            >
              Save
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 px-4 py-2 rounded-full text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      {/* RIGHT PANEL – COMMENTS */}
      <div className="w-full lg:w-96 border-t lg:border-l p-4 flex flex-col h-48 md:h-80 lg:h-auto max-h-[35vh] md:max-h-[50vh] lg:max-h-[60vh]">
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">
            Comments
          </h3>

            <div className="space-y-3">
              {comments.length ? (
                comments.map((c, i) => (
                  <div key={i} className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                    <p className="text-sm text-gray-800 dark:text-white">
                      {c.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments</p>
              )}
            </div>
          </div>

          {/* Comment Input */}
          <div className="flex gap-2 pt-3 sticky bottom-0 bg-white dark:bg-gray-800">
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
            />
            <button
              onClick={handleAddComment}
              className="bg-yellow-400 px-4 rounded-lg"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default TaskViewModal
