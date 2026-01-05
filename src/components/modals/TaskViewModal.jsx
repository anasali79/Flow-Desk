import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedTask, updateTask, deleteTask } from '../../store/taskSlice'
import { fetchComments, addComment, selectAllComments } from '../../store/commentSlice'
import { commentAPI } from '../../services/api'

const TaskViewModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const task = useSelector(selectSelectedTask)
  const allComments = useSelector(selectAllComments)
  const [newComment, setNewComment] = useState('')
  const [attachments, setAttachments] = useState(task?.attachments || [])

  // Filter comments for the current task
  const comments = allComments.filter(comment => comment.taskId === task?.id)

  useEffect(() => {
    if (task?.id) {
      dispatch(fetchComments(task.id))
      setAttachments(task.attachments || [])
      // Update the form state when the task changes
      setUpdatedTask({
        title: task.title,
        stage: task.stage || 'Not started',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate || 'Today',
        type: task.type || 'Report',
        project: task.project || '',
        team: task.team || '',
        description: task.description || '',
        status: task.status || 'pending',
      })
    }
  }, [task, dispatch])

  // Function to refresh comments when comments state changes
  useEffect(() => {
    if (task?.id) {
      dispatch(fetchComments(task.id))
    }
  }, [dispatch, task?.id, allComments])

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return

    try {
      const commentData = {
        taskId: task.id,
        text: newComment,
        author: 'You',
        createdAt: new Date().toISOString(),
      }
      await dispatch(addComment(commentData))
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id))
      onClose()
    }
  }

  if (!task) return null

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-orange-700 text-white'
      case 'Medium': return 'bg-yellow-400 text-black'
      case 'Low': return 'bg-yellow-200 text-black'
      default: return 'bg-gray-200 text-black'
    }
  }

  const getStageColor = (stage) => {
    switch (stage) {
      case 'In progress': return 'bg-yellow-400 text-black'
      case 'Completed': return 'bg-green-500 text-white'
      case 'Not started': return 'bg-gray-200 text-black'
      default: return 'bg-gray-200 text-black'
    }
  }

  const [updatedTask, setUpdatedTask] = useState({
    title: task.title,
    stage: task.stage || 'Not started',
    priority: task.priority || 'Medium',
    dueDate: task.dueDate || 'Today',
    type: task.type || 'Report',
    project: task.project || '',
    team: task.team || '',
    description: task.description || '',
    status: task.status || 'pending',
  })

  const handleUpdateStage = (newStage) => {
    // When stage changes, also update status appropriately
    let newStatus = updatedTask.status;
    if (newStage === 'Completed') {
      newStatus = 'completed';
    } else if (newStage === 'Not started' || newStage === 'In progress') {
      newStatus = 'pending';
    }
    setUpdatedTask(prev => ({ ...prev, stage: newStage, status: newStatus }))
  }

  const handleToggleStatus = () => {
    const newStatus = updatedTask.status === 'completed' ? 'pending' : 'completed'
    // When status changes, also update stage appropriately
    let newStage = updatedTask.stage;
    if (newStatus === 'completed') {
      newStage = 'Completed';
    } else if (newStatus === 'pending' && updatedTask.stage === 'Completed') {
      newStage = 'In progress';
    }
    setUpdatedTask(prev => ({ ...prev, status: newStatus, stage: newStage }))
  }

  const handleUpdatePriority = (newPriority) => {
    setUpdatedTask(prev => ({ ...prev, priority: newPriority }))
  }

  const handleUpdateTitle = (newTitle) => {
    setUpdatedTask(prev => ({ ...prev, title: newTitle }))
  }

  const handleUpdateDueDate = (newDueDate) => {
    setUpdatedTask(prev => ({ ...prev, dueDate: newDueDate }))
  }


  const handleUpdateProject = (newProject) => {
    setUpdatedTask(prev => ({ ...prev, project: newProject }))
  }

  const handleUpdateTeam = (newTeam) => {
    setUpdatedTask(prev => ({ ...prev, team: newTeam }))
  }

  const handleUpdateDescription = (newDescription) => {
    setUpdatedTask(prev => ({ ...prev, description: newDescription }))
  }

  const handleSaveTask = async () => {
    try {
      await dispatch(updateTask({ id: task.id, updates: updatedTask }))
      // Close the modal after saving
      onClose()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col lg:flex-row shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Panel */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <button
                onClick={handleToggleStatus}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  updatedTask.status === 'completed'
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {updatedTask.status === 'completed' && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <input
                type="text"
                value={updatedTask.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                className={` cursor-text hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md p-2 text-2xl font-bold ${
                  updatedTask.status === 'completed'
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-800 dark:text-white'
                } bg-transparent border-none focus:outline-none focus:ring-0 p-0 flex-1`}
              />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <textarea
            value={updatedTask.description}
            onChange={(e) => handleUpdateDescription(e.target.value)}
            className="w-full cursor-text hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md p-2 text-gray-600  dark:text-gray-300 mb-6 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Add description..."
            rows="3"
          />

          {/* Info Section */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
              <span className="ml-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-900 dark:text-white">
                {updatedTask.type || task.type || 'Report'}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Priority:</span>
              <select
                value={updatedTask.priority}
                onChange={(e) => handleUpdatePriority(e.target.value)}
                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(updatedTask.priority)}`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Deadline:</span>
              <select
                value={updatedTask.dueDate}
                onChange={(e) => handleUpdateDueDate(e.target.value)}
                className="ml-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Friday">Friday</option>
                <option value="This week">This week</option>
              </select>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Stage:</span>
              <select
                value={updatedTask.stage}
                onChange={(e) => handleUpdateStage(e.target.value)}
                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStageColor(updatedTask.stage)}`}
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSaveTask}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Task</span>
            </button>
           
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete task</span>
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex flex-col max-h-[50vh] lg:max-h-none overflow-y-auto">
        

          {/* Comments */}
          <div className="flex-1 overflow-y-auto mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Comments</h3>
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={comment.id || index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm text-gray-800 dark:text-white">{comment.author || 'Anonymous'}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text || comment.comment || ''}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No comments yet</p>
              )}
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Attachments</h3>
            <div className="space-y-2">
              {attachments.length > 0 ? (
                attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      file.name?.includes('.xls') ? 'bg-green-500' :
                      file.name?.includes('.pptx') ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}>
                      <span className="text-white text-xs">📄</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{file.name}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">📊</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">E-commerce numbers.xls</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 rounded bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs">📊</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">SAP numbers.pptx</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs">📄</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">New products.doc</span>
                  </div>
                </>
              )}
            </div>
            <button className="mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span>Attach</span>
            </button>
          </div>

          {/* New Comment Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Comment, or type / for comment"
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={handleAddComment}
              className="w-10 h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskViewModal

