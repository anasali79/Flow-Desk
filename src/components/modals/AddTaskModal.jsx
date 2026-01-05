import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTask } from '../../store/taskSlice'

const AddTaskModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    day: 'Today',
    customDay: '',
    priority: null,
    tags: [],
    newTag: '',
    description: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const taskData = {
      title: formData.name,
      name: formData.name,
      dueDate: formData.customDay || formData.day,
      priority: formData.priority || 'Medium',
      tags: formData.tags,
      description: formData.description,
      stage: 'Not started',
      status: 'pending',
    }

    dispatch(addTask(taskData))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-2xl shadow-xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Name of task</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name of task</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter task name"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
          </div>

          {/* Day */}
          <div className="flex items-center gap-4">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex gap-2 flex-wrap items-center">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, day: 'Today', customDay: '' })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.day === 'Today'
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, day: 'Tomorrow', customDay: '' })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.day === 'Tomorrow'
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Tomorrow
              </button>
              {/* Custom date picker (+) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center"
                  onClick={() => {
                    // Focus will happen on the input rendered below
                    if (!formData.customDay) {
                      setFormData({ ...formData, customDay: new Date().toISOString().slice(0, 10) })
                    }
                  }}
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                {formData.customDay && (
                  <input
                    type="date"
                    value={formData.customDay}
                    onChange={(e) => setFormData({ ...formData, customDay: e.target.value, day: 'Custom' })}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 dark:text-white"
                  />
                )}
              </div>
            </div>
          </div>



          {/* Priority */}
          <div className="flex items-center gap-4">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <button
              type="button"
              onClick={() => {
                const priorities = ['High', 'Medium', 'Low']
                const currentIndex = priorities.indexOf(formData.priority || 'Medium')
                const nextIndex = (currentIndex + 1) % priorities.length
                setFormData({ ...formData, priority: priorities[nextIndex] })
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{formData.priority ? `Priority: ${formData.priority}` : '+ Add priority'}</span>
            </button>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-4">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <div className="flex-1 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((_, i) => i !== index),
                      })
                    }
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={formData.newTag}
                onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.newTag.trim()) {
                    e.preventDefault()
                    if (!formData.tags.includes(formData.newTag.trim())) {
                      setFormData({
                        ...formData,
                        tags: [...formData.tags, formData.newTag.trim()],
                        newTag: '',
                      })
                    }
                  }
                }}
                placeholder="+ Add tags"
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Create Task Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors"
            >
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTaskModal

