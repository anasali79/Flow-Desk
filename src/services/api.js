import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const taskAPI = {
  getTasks: async () => {
    try {
      return await api.get('/tasks')
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  },

  createTask: async (taskData) => {
    try {
      const newTask = {
        title: taskData.title || taskData.name,
        description: taskData.description || '',
        dueDate: taskData.dueDate || 'Today',
        stage: taskData.stage || 'Not started',
        priority: taskData.priority || 'Medium',
        team: taskData.team || '',
        assignee: taskData.assignee || null,
        type: taskData.type || '',
        project: taskData.project || '',
        tags: taskData.tags || [],

        status: taskData.status || 'pending',
        createdAt: new Date().toISOString(),
      }
      return await api.post('/tasks', newTask)
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  },

  updateTask: async (id, updates) => {
    try {
      return await api.put(`/tasks/${id}`, updates)
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },

  deleteTask: async (id) => {
    try {
      return await api.delete(`/tasks/${id}`)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  },
}

export const commentAPI = {
  getComments: async (taskId) => {
    try {
      let url = '/comments'
      if (taskId) {
        url = `/comments?taskId=${taskId}`
      }
      return await api.get(url)
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  },

  addComment: async (commentData) => {
    try {
      const newComment = {
        ...commentData,
        createdAt: new Date().toISOString(),
      }
      return await api.post('/comments', newComment)
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  },

  updateComment: async (id, updates) => {
    try {
      return await api.put(`/comments/${id}`, updates)
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  },

  deleteComment: async (id) => {
    try {
      return await api.delete(`/comments/${id}`)
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  },
}


export const userAPI = {
  getUser: async () => {
    try {
      return await api.get('/user')
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  updateUser: async (updates) => {
    try {
      return await api.put('/user', updates)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },
}
