import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userAPI } from '../services/api'

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => {
    const response = await userAPI.getUser()
    return response.data
  }
)

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (updates) => {
    const response = await userAPI.updateUser(updates)
    return response.data
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: {
      id: 1,
      name: 'John Deere',
      email: 'john.deere@email.com',
      avatar: null,
      profilePhoto: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setProfilePhoto: (state, action) => {
      state.currentUser.profilePhoto = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.currentUser = { ...state.currentUser, ...action.payload }
      })
  },
})

export const { setProfilePhoto } = userSlice.actions
export const selectCurrentUser = (state) => state.user.currentUser
export default userSlice.reducer

