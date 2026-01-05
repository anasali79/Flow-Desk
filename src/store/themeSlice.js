import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    return savedTheme
  }
  // Check system preference if no saved theme
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

const initialTheme = getInitialTheme()

// Apply theme to DOM on initialization
if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  localStorage.setItem('theme', initialTheme)
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: initialTheme,
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.mode)
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', state.mode === 'dark')
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      localStorage.setItem('theme', action.payload)
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', action.payload === 'dark')
      }
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export const selectTheme = (state) => state.theme.mode

export default themeSlice.reducer

