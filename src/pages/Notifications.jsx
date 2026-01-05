import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, markNotificationRead, setSelectedNotification, selectAllNotifications, selectSelectedNotification } from '../store/notificationSlice'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const Notifications = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const selectedNotification = useSelector(selectSelectedNotification)
  const [localNotifications, setLocalNotifications] = useState([])

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  useEffect(() => {
    // Default notifications if API doesn't return any
    if (notifications.length === 0) {
      setLocalNotifications([
        {
          id: 1,
          title: 'Company research',
          message: 'John Deere added a new task.',
          status: 'pending',
          author: 'John Deere',
          date: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Company research',
          message: 'John Deere marked the task complete.',
          status: 'completed',
          author: 'John Deere',
          date: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 3,
          title: 'Market ideation',
          message: 'John Deere marked the task complete.',
          status: 'completed',
          author: 'John Deere',
          date: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 4,
          title: 'Illustrations invoicing',
          message: 'John Deere marked the task on hold.',
          status: 'pending',
          author: 'John Deere',
          date: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: 5,
          title: 'Yearly wrap-up',
          message: 'John Deere marked the task complete.',
          status: 'completed',
          author: 'John Deere',
          date: new Date(Date.now() - 345600000).toISOString(),
        },
      ])
    } else {
      setLocalNotifications(notifications)
    }
  }, [notifications])

  const handleNotificationClick = (notification) => {
    dispatch(setSelectedNotification(notification))
    if (!notification.read && notification.id) {
      dispatch(markNotificationRead(notification.id))
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <Sidebar activePage="notifications" />
      <div className="flex-1 ml-64">
        <Header />
        <div className="p-6 flex gap-6 h-[calc(100vh-80px)]">
          {/* Left Panel - Notifications List */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Latest notifications</h2>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {localNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedNotification?.id === notification.id
                      ? 'bg-yellow-50 border-l-4 border-yellow-400'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {notification.status === 'completed' ? (
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className={`w-6 h-6 border-2 rounded-full ${notification.read ? 'border-gray-200' : 'border-gray-300'}`}></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${notification.read ? 'text-gray-500' : 'text-gray-800'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {notification.author?.charAt(0) || 'J'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Notification Details */}
          {selectedNotification && (
            <div className="w-96 bg-white rounded-xl shadow-sm p-6 overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedNotification.title}</h2>
                <button
                  onClick={() => dispatch(setSelectedNotification(null))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Task Attributes */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">Me</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="px-3 py-1 bg-black text-white rounded-full text-sm">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">Secret project</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-yellow-200 text-black rounded-full text-sm font-semibold">CE</span>
                  <span className="px-3 py-1 bg-yellow-200 text-black rounded-full text-sm">Medium</span>
                </div>
              </div>

              {/* Attachments */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Attachments</h3>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm text-gray-600">No attachments</span>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>Attach</span>
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Links</h3>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-sm text-gray-600">No links</span>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span>Archive task</span>
                </button>
                <button className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete task</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications

