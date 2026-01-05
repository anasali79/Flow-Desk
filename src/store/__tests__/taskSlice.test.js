import { describe, it, expect, beforeEach } from 'vitest'
import taskReducer, {
  setFilter,
  setSearchQuery,
  setSelectedTask,
  setFilters,
  clearFilters,
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
} from '../taskSlice'

describe('taskSlice', () => {
  const initialState = {
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
  }

  beforeEach(() => {
    // Reset state before each test
  })

  describe('reducers', () => {
    it('should set filter correctly', () => {
      const action = setFilter('completed')
      const state = taskReducer(initialState, action)
      
      expect(state.filter).toBe('completed')
    })

    it('should set search query correctly', () => {
      const action = setSearchQuery('test query')
      const state = taskReducer(initialState, action)
      
      expect(state.searchQuery).toBe('test query')
    })

    it('should set selected task correctly', () => {
      const task = { id: 1, title: 'Test Task' }
      const action = setSelectedTask(task)
      const state = taskReducer(initialState, action)
      
      expect(state.selectedTask).toEqual(task)
    })

    it('should set filters correctly', () => {
      const filters = { project: 'Project 1', team: 'Team A' }
      const action = setFilters(filters)
      const state = taskReducer(initialState, action)
      
      expect(state.filters.project).toBe('Project 1')
      expect(state.filters.team).toBe('Team A')
    })

    it('should clear filters correctly', () => {
      const stateWithFilters = {
        ...initialState,
        filters: {
          project: 'Project 1',
          deadline: 'Today',
          type: 'Report',
          team: 'Team A',
        },
      }
      
      const action = clearFilters()
      const state = taskReducer(stateWithFilters, action)
      
      expect(state.filters.project).toBeNull()
      expect(state.filters.deadline).toBeNull()
      expect(state.filters.type).toBeNull()
      expect(state.filters.team).toBeNull()
    })
  })

  describe('async thunks', () => {
    it('should handle fetchTasks.pending', () => {
      const action = { type: fetchTasks.pending.type }
      const state = taskReducer(initialState, action)
      
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchTasks.fulfilled', () => {
      const tasks = [
        { id: 1, title: 'Task 1', status: 'pending' },
        { id: 2, title: 'Task 2', status: 'completed' },
      ]
      const action = { type: fetchTasks.fulfilled.type, payload: tasks }
      const state = taskReducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.items).toEqual(tasks)
    })

    it('should handle fetchTasks.rejected', () => {
      const error = 'Failed to fetch tasks'
      const action = { type: fetchTasks.rejected.type, error: { message: error } }
      const state = taskReducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
    })

    it('should handle addTask.fulfilled', () => {
      const newTask = { id: 1, title: 'New Task', status: 'pending' }
      const action = { type: addTask.fulfilled.type, payload: newTask }
      const state = taskReducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.items).toContainEqual(newTask)
    })

    it('should handle updateTask.fulfilled', () => {
      const stateWithTask = {
        ...initialState,
        items: [{ id: 1, title: 'Old Task', status: 'pending' }],
      }
      
      const updatedTask = { id: 1, title: 'Updated Task', status: 'completed' }
      const action = { type: updateTask.fulfilled.type, payload: updatedTask }
      const state = taskReducer(stateWithTask, action)
      
      expect(state.loading).toBe(false)
      expect(state.items[0]).toEqual(updatedTask)
    })

    it('should handle deleteTask.fulfilled', () => {
      const stateWithTasks = {
        ...initialState,
        items: [
          { id: 1, title: 'Task 1', status: 'pending' },
          { id: 2, title: 'Task 2', status: 'pending' },
        ],
      }
      
      const action = { type: deleteTask.fulfilled.type, payload: 1 }
      const state = taskReducer(stateWithTasks, action)
      
      expect(state.loading).toBe(false)
      expect(state.items).toHaveLength(1)
      expect(state.items[0].id).toBe(2)
    })
  })
})

