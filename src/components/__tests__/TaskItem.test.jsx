import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, userEvent } from '../../test/test-utils'
import TaskItem from '../TaskItem'
import { updateTask, deleteTask } from '../../store/taskSlice'

// Mock window.confirm
global.window.confirm = vi.fn(() => true)

// Mock Redux actions but keep the reducer
vi.mock('../../store/taskSlice', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  }
})

describe('TaskItem Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    status: 'pending',
    stage: 'Not started',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders task title correctly', () => {
    const { getByText } = renderWithProviders(<TaskItem task={mockTask} />)
    
    expect(getByText('Test Task')).toBeInTheDocument()
  })

  it('displays task status badge', () => {
    const { getByText } = renderWithProviders(<TaskItem task={mockTask} />)
    
    expect(getByText('Pending')).toBeInTheDocument()
  })

  it('shows completed status for completed tasks', () => {
    const completedTask = { ...mockTask, status: 'completed' }
    const { getByText } = renderWithProviders(<TaskItem task={completedTask} />)
    
    expect(getByText('Completed')).toBeInTheDocument()
  })

  it('renders edit, delete, and mark complete buttons', () => {
    const { getByText } = renderWithProviders(<TaskItem task={mockTask} />)
    
    expect(getByText('Edit')).toBeInTheDocument()
    expect(getByText('Delete')).toBeInTheDocument()
    expect(getByText('Mark Complete')).toBeInTheDocument()
  })

  it('shows edit form when edit button is clicked', async () => {
    const user = userEvent.setup()
    const { getByText } = renderWithProviders(<TaskItem task={mockTask} />)
    
    const editButton = getByText('Edit')
    await user.click(editButton)
    
    // Should show the edit form (EditTask component)
    expect(getByText('Task Title')).toBeInTheDocument()
  })

  it('calls deleteTask when delete button is clicked', async () => {
    const user = userEvent.setup()
    const { getByText } = renderWithProviders(<TaskItem task={mockTask} />)
    
    const deleteButton = getByText('Delete')
    await user.click(deleteButton)
    
    expect(deleteTask).toHaveBeenCalledWith(mockTask.id)
  })

  it('calls updateTask when mark complete button is clicked', async () => {
    const user = userEvent.setup()
    const { getByText } = renderWithProviders(<TaskItem task={mockTask} />)
    
    const markCompleteButton = getByText('Mark Complete')
    await user.click(markCompleteButton)
    
    expect(updateTask).toHaveBeenCalledWith({
      id: mockTask.id,
      updates: expect.objectContaining({
        status: 'completed',
      }),
    })
  })

  it('shows mark pending button for completed tasks', () => {
    const completedTask = { ...mockTask, status: 'completed' }
    const { getByText } = renderWithProviders(<TaskItem task={completedTask} />)
    
    expect(getByText('Mark Pending')).toBeInTheDocument()
  })
})

