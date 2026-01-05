import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAllTasks } from '../../store/taskSlice'

const STORAGE_KEY = 'trackingActivities'

const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const parts = []
  if (h > 0) parts.push(`${h}h`)
  if (m > 0 || h > 0) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

const MyTrackingWidget = () => {
  const tasks = useSelector(selectAllTasks)
  const [activities, setActivities] = useState([])
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [customName, setCustomName] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)

  // Load from localStorage on mount and restore running state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const now = Date.now()
        const normalized = parsed.map((a) => {
          // If it was running when browser closed, continue it
          if (a.isRunning && a.lastStartedAt) {
            const elapsed = Math.floor((now - a.lastStartedAt) / 1000)
            return {
              ...a,
              seconds: a.seconds + Math.max(elapsed, 0),
              isRunning: true, // Keep it running
              lastStartedAt: now, // Reset start time to now
            }
          }
          // If it was paused, keep it paused
          return { ...a, isRunning: false, lastStartedAt: null }
        })
        setActivities(normalized)
      }
    } catch {
      // ignore parse errors
    }
  }, [])


  // Timer tick for running activities - updates every second
  useEffect(() => {
    if (!activities.some((a) => a.isRunning)) return

    const interval = setInterval(() => {
      setActivities((prev) =>
        prev.map((a) =>
          a.isRunning ? { ...a, seconds: a.seconds + 1 } : a
        )
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [activities])

  // Save to localStorage whenever activities change (including timer updates)
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
    }
  }, [activities])

  const toggleActivity = (id) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          if (a.isRunning) {
            // Pause: update seconds based on lastStartedAt
            const now = Date.now()
            const elapsed =
              a.lastStartedAt != null
                ? Math.floor((now - a.lastStartedAt) / 1000)
                : 0
            return {
              ...a,
              isRunning: false,
              seconds: a.seconds + Math.max(elapsed, 0),
              lastStartedAt: null,
            }
          }
          // Start: set lastStartedAt (other timers can keep running)
          return {
            ...a,
            isRunning: true,
            lastStartedAt: Date.now(),
          }
        }
        return a
      })
    )
  }

  const deleteActivity = (id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id))
    if (openMenuId === id) setOpenMenuId(null)
  }

  const addActivity = () => {
    const task =
      selectedTaskId && tasks.find((t) => String(t.id) === selectedTaskId)
    const name = task?.title || customName.trim()
    if (!name) return

    setActivities((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        taskId: task ? task.id : null,
        seconds: 0,
        isRunning: false,
        lastStartedAt: null,
      },
    ])
    setSelectedTaskId('')
    setCustomName('')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">My tracking</h3>
        <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 -mx-4 overflow-hidden">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`relative flex items-center justify-between px-4 py-3 transition-colors ${
              index === 0 ? '' : 'border-t border-gray-200 dark:border-gray-700'
            } ${
              index === activities.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
            } ${
              activity.isRunning ? 'bg-yellow-50 dark:bg-yellow-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Yellow strip for active tracking */}
              {activity.isRunning && (
                <div className="w-1 h-10 bg-yellow-400 rounded-r-md mr-1" />
              )}
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {activity.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatTime(activity.seconds)}
              </span>
              {/* Play / Pause */}
              <button
                onClick={() => toggleActivity(activity.id)}
                className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                  activity.isRunning ? 'bg-yellow-400 border-yellow-400' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}
              >
                {activity.isRunning ? (
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 4a1 1 0 00-1 1v10a1 1 0 002 0V5a1 1 0 00-1-1zm7 0a1 1 0 00-1 1v10a1 1 0 002 0V5a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-black dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 4l10 6-10 6V4z" />
                  </svg>
                )}
              </button>
              {/* More menu */}
              <button
                onClick={() =>
                  setOpenMenuId((current) =>
                    current === activity.id ? null : activity.id
                  )
                }
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {openMenuId === activity.id && (
                <div className="absolute right-2 top-10 z-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md text-sm">
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add tracking row */}
      <div className="mt-3 px-2 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 dark:text-white"
        >
          <option value="">Select task</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Or custom name"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          onClick={addActivity}
          className="w-full sm:w-10 h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center text-black font-bold text-xl"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default MyTrackingWidget

