import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addComment } from '../../store/commentSlice'

const AddCommentModal = ({ tasks, onClose }) => {
  const dispatch = useDispatch()
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [commentText, setCommentText] = useState('')
  const [author, setAuthor] = useState('You')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedTaskId || !commentText.trim()) {
      alert('Please select a task and enter a comment')
      return
    }

    const commentData = {
      taskId: parseInt(selectedTaskId),
      text: commentText.trim(),
      author: author.trim() || 'You',
      createdAt: new Date().toISOString(),
    }

    dispatch(addComment(commentData))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-4 sm:p-6 shadow-xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add Comment</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Task</label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Choose a task...</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter your comment..."
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-black dark:text-gray-900 font-medium"
            >
              Add Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCommentModal