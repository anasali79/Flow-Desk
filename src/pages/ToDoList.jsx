import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTasks,
  updateTask,
  setSelectedTask,
  selectFilteredTasks,
  selectTasksFilters,
  clearFilters,
  setSearchQuery,
  setFilter
} from '../store/taskSlice'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import AddTaskModal from '../components/modals/AddTaskModal'
import TaskViewModal from '../components/modals/TaskViewModal'
import AddFiltersModal from '../components/modals/AddFiltersModal'
import FilterButtons from '../components/FilterButtons'

const ToDoList = () => {
  const dispatch = useDispatch()
  const tasks = useSelector(selectFilteredTasks)
  const activeFilters = useSelector(selectTasksFilters)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showTaskView, setShowTaskView] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  const handleTaskClick = (task) => {
    dispatch(setSelectedTask(task))
    setShowTaskView(true)
  }

  const handleToggleTask = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    let newStage = task.stage

    if (newStatus === 'completed') newStage = 'Completed'
    else if (task.stage === 'Completed') newStage = 'In progress'

    await dispatch(updateTask({
      id: task.id,
      updates: { status: newStatus, stage: newStage }
    }))
  }

  const getTasksByDueDate = (dueDate) => {
    return tasks.filter(task => {
      const taskDueDate = task.dueDate || 'Today'
      if (dueDate === 'Today') return taskDueDate === 'Today'
      if (dueDate === 'Tomorrow') return taskDueDate === 'Tomorrow'
      return ['Wednesday', 'Friday', 'This week'].includes(taskDueDate)
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-orange-700 text-white'
      case 'Medium': return 'bg-orange-500 text-white'
      case 'Low': return 'bg-yellow-200 text-black'
      default: return 'bg-gray-200 text-black'
    }
  }

  const getStageColor = (stage) => {
    switch (stage) {
      case 'In progress': return 'bg-yellow-400 text-black'
      case 'Not started': return 'bg-gray-200 text-black'
      default: return 'bg-gray-200 text-black'
    }
  }

  const sections = [
    { title: 'Today', dueDate: 'Today' },
    { title: 'Tomorrow', dueDate: 'Tomorrow' },
    { title: 'This week', dueDate: 'This week' },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 flex">
      <Sidebar activePage="tasks" />

      <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <Header onNewTask={() => setShowAddModal(true)} title="To do list" />

        <div className="p-4 sm:p-6">
          <FilterButtons />

          {/* SECTIONS */}
          {sections.map((section) => {
            const sectionTasks = getTasksByDueDate(section.dueDate)
            if (sectionTasks.length === 0) return null

            return (
              <div key={section.title} className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  {section.title}
                </h2>

                {/* ✅ SINGLE CARD */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

                  {sectionTasks.map((task, index) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`p-4 md:grid md:grid-cols-10 md:gap-4 md:items-center cursor-pointer
                        hover:bg-gray-50 dark:hover:bg-gray-700 transition
                        ${index !== sectionTasks.length - 1
                          ? 'border-b border-gray-200 dark:border-gray-700'
                          : ''}`}
                    >

                      {/* MOBILE */}
                      <div className="md:hidden space-y-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleTask(task)
                            }}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                              ${task.status === 'completed'
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 dark:border-gray-600'}`}
                          >
                            {task.status === 'completed' && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>

                          <div className="flex-1">
                            <span className={`text-sm font-medium block
                              ${task.status === 'completed'
                                ? 'line-through text-gray-500'
                                : 'text-gray-800 dark:text-gray-200'}`}>
                              {task.title}
                            </span>

                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs text-gray-500">{task.dueDate}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStageColor(task.stage)}`}>
                                {task.stage}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* DESKTOP */}
                      <div className="hidden md:flex md:col-span-5 gap-3 items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleTask(task)
                          }}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${task.status === 'completed'
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 dark:border-gray-600'}`}
                        >
                          {task.status === 'completed' && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        <span className={`${task.status === 'completed'
                          ? 'line-through text-gray-500'
                          : 'text-gray-800 dark:text-gray-200'}`}>
                          {task.title}
                        </span>
                      </div>

                      <div className="hidden md:block md:col-span-2 text-sm text-gray-500">
                        {task.dueDate}
                      </div>

                      <div className="hidden md:block md:col-span-2">
                        <span className={`px-3 py-1 rounded-full text-xs ${getStageColor(task.stage)}`}>
                          {task.stage}
                        </span>
                      </div>

                      <div className="hidden md:block md:col-span-1">
                        <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
      {showTaskView && <TaskViewModal onClose={() => setShowTaskView(false)} />}
      {showFiltersModal && <AddFiltersModal onClose={() => setShowFiltersModal(false)} />}
    </div>
  )
}

export default ToDoList
