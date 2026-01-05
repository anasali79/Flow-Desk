import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationAPI } from '../services/api'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await notificationAPI.getNotifications()
    return response.data
  }
)

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id) => {
    const response = await notificationAPI.markRead(id)
    return response.data
  }
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    selectedNotification: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedNotification: (state, action) => {
      state.selectedNotification = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.items.findIndex(n => n.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
  },
})

export const { setSelectedNotification } = notificationSlice.actions
export const selectAllNotifications = (state) => state.notifications.items
export const selectSelectedNotification = (state) => state.notifications.selectedNotification
export default notificationSlice.reducer

