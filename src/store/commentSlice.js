import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { commentAPI } from '../services/api'

// Async thunks for API calls
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (taskId = null) => {
    try {
      let response;
      if (taskId !== null && taskId !== undefined) {
        response = await commentAPI.getComments(taskId)
      } else {
        // Get all comments if no specific task is requested
        response = await commentAPI.getComments()
      }
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  }
)

export const addComment = createAsyncThunk(
  'comments/addComment',
  async (commentData) => {
    const response = await commentAPI.addComment(commentData)
    return response.data
  }
)

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, updates }) => {
    const response = await commentAPI.updateComment(id, updates)
    return response.data
  }
)

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id) => {
    await commentAPI.deleteComment(id)
    return id
  }
)

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedComment: null,
  },
  reducers: {
    setSelectedComment: (state, action) => {
      state.selectedComment = action.payload
    },
    clearComments: (state) => {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(addComment.rejected, (state, action) => {
        console.error('Error adding comment:', action.error.message)
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.items.findIndex(comment => comment.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter(comment => comment.id !== action.payload)
      })
  },
})

export const { setSelectedComment, clearComments } = commentSlice.actions

export const selectAllComments = (state) => state.comments.items
export const selectCommentsByTask = (taskId) => (state) => {
  return state.comments.items.filter(comment => comment.taskId === taskId)
}

export default commentSlice.reducer