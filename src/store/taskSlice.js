import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { taskAPI } from '../services/api'

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await taskAPI.getTasks()
    return response.data
  }
)

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData) => {
    const response = await taskAPI.createTask(taskData)
    return response.data
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }, { getState }) => {
    // Merge incoming updates with the existing task so we always send
    // a full object to the API (important for json-server style backends)
    const state = getState()
    const existingTask = state.tasks.items.find((task) => task.id === id) || {}
    const payload = { ...existingTask, ...updates }

    const response = await taskAPI.updateTask(id, payload)
    return response.data
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id) => {
    await taskAPI.deleteTask(id)
    return id
  }
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    selectedTask: null,
    filter: 'all',
    searchQuery: '',
    filters: {
      project: null,
      deadline: null,
      type: null,
      team: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        project: null,
        deadline: null,
        type: null,
        team: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(task => task.id !== action.payload)
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setFilter, setSearchQuery, setSelectedTask, setFilters, clearFilters } = taskSlice.actions

export const selectAllTasks = (state) => state.tasks.items
export const selectSelectedTask = (state) => state.tasks.selectedTask
export const selectFilter = (state) => state.tasks.filter
export const selectSearchQuery = (state) => state.tasks.searchQuery
export const selectTasksFilters = (state) => state.tasks.filters
export const selectTasksLoading = (state) => state.tasks.loading
export const selectTasksError = (state) => state.tasks.error

export const selectFilteredTasks = (state) => {
  const tasks = state.tasks.items
  const filter = state.tasks.filter
  const searchQuery = state.tasks.searchQuery.toLowerCase()
  const filters = state.tasks.filters

  let filtered = tasks

  // Apply status filter
  if (filter === 'completed') {
    filtered = filtered.filter(task => task.status === 'completed')
  } else if (filter === 'pending') {
    filtered = filtered.filter(task => task.status === 'pending')
  }
  // Note: 'all' filter shows all tasks

  // Apply search
  if (searchQuery) {
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(searchQuery)
    )
  }

  // Apply custom filters
  if (filters.project) {
    filtered = filtered.filter(task => task.project === filters.project)
  }
  if (filters.deadline) {
    filtered = filtered.filter(task => task.dueDate === filters.deadline)
  }
  if (filters.type) {
    filtered = filtered.filter(task => task.type === filters.type)
  }
  if (filters.team) {
    filtered = filtered.filter(task => task.team === filters.team)
  }
  return filtered
}

export default taskSlice.reducer

