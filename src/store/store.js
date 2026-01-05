import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './taskSlice'
import themeReducer from './themeSlice'
import userReducer from './userSlice'
import commentReducer from './commentSlice'

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    theme: themeReducer,
    user: userReducer,
    comments: commentReducer,
  },
})

