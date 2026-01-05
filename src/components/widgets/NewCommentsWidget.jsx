import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchComments, selectAllComments } from '../../store/commentSlice'
import { fetchTasks, selectAllTasks } from '../../store/taskSlice'

import AddCommentModal from '../modals/AddCommentModal'

const NewCommentsWidget = () => {
  const dispatch = useDispatch()

  const comments = useSelector(selectAllComments)
  const tasks = useSelector(selectAllTasks)

  const [showAddModal, setShowAddModal] = useState(false)

  // ✅ Fetch BOTH tasks & comments
  useEffect(() => {
    dispatch(fetchTasks())
    dispatch(fetchComments())
  }, [dispatch])

  // ✅ Map comments with correct task title
  const commentsWithTaskTitle = comments
    .map(comment => {
      const task = tasks.find(
        t => String(t.id) === String(comment.taskId) // 🔥 id mismatch fix
      )

      return {
        ...comment,
        title: task ? task.title : `Task #${comment.taskId || 'Unknown'}`,
      }
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt || '1970-01-01') -
        new Date(a.createdAt || '1970-01-01')
    )

  // ✅ Only show latest 5
  const recentComments = commentsWithTaskTitle.slice(0, 5)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        New comments
      </h3>

      <div className="-mx-6 mb-4">
        {recentComments.length > 0 ? (
          recentComments.map((comment, index) => (
            <div
              key={comment.id}
              className={`flex items-start justify-between gap-3 px-6 py-4 ${
                index === 0 ? '' : 'border-t border-gray-200 dark:border-gray-700'
              } ${
                index === recentComments.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
              } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer`}
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                  {comment.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {comment.text || comment.comment}
                </p>
              </div>

              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No comments yet
          </div>
        )}
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add</span>
      </button>

      {showAddModal && (
        <AddCommentModal
          tasks={tasks}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

export default NewCommentsWidget
