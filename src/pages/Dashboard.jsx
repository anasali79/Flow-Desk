import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchTasks } from '../store/taskSlice'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import CalendarWidget from '../components/widgets/CalendarWidget'
import MyTasksWidget from '../components/widgets/MyTasksWidget'
import NewCommentsWidget from '../components/widgets/NewCommentsWidget'
import MyCategoriesWidget from '../components/widgets/MyCategoriesWidget'
import MyTrackingWidget from '../components/widgets/MyTrackingWidget'
import AddTaskModal from '../components/modals/AddTaskModal'

function Dashboard() {
  const dispatch = useDispatch()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    // Fetch tasks on mount
    dispatch(fetchTasks())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {/* Header */}
        <Header onNewTask={() => setShowAddModal(true)} />

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6">
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <CalendarWidget />
            <MyTasksWidget />
            <NewCommentsWidget />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <MyCategoriesWidget />
            <MyTrackingWidget />
          </div>
        </div>
      </div>

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}

export default Dashboard
