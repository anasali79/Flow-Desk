import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, userEvent } from '../../test/test-utils'
import AddTask from '../AddTask'

// Mock the Redux action but keep the reducer
vi.mock('../../store/taskSlice', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    addTask: vi.fn((title) => ({
      type: 'tasks/addTask',
      payload: { title },
    })),
  }
})

describe('AddTask Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form correctly', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<AddTask />)
    
    expect(getByText('Add New Task')).toBeInTheDocument()
    expect(getByPlaceholderText('Enter task title...')).toBeInTheDocument()
    expect(getByText('Add Task')).toBeInTheDocument()
  })

  it('allows user to type in the input field', async () => {
    const user = userEvent.setup()
    const { getByPlaceholderText } = renderWithProviders(<AddTask />)
    const input = getByPlaceholderText('Enter task title...')
    
    await user.type(input, 'New Task')
    
    expect(input).toHaveValue('New Task')
  })

  it('shows error message when submitting empty form', async () => {
    const user = userEvent.setup()
    const { getByText, getByPlaceholderText } = renderWithProviders(<AddTask />)
    const submitButton = getByText('Add Task')
    
    await user.click(submitButton)
    
    expect(getByText('Task title is required')).toBeInTheDocument()
  })

  it('dispatches addTask action when form is submitted with valid title', async () => {
    const user = userEvent.setup()
    const { getByText, getByPlaceholderText } = renderWithProviders(<AddTask />)
    const input = getByPlaceholderText('Enter task title...')
    const submitButton = getByText('Add Task')
    
    await user.type(input, 'Test Task')
    await user.click(submitButton)
    
    // Check that the input is cleared after submission
    expect(input).toHaveValue('')
  })

  it('clears error message when user starts typing', async () => {
    const user = userEvent.setup()
    const { getByText, getByPlaceholderText, queryByText } = renderWithProviders(<AddTask />)
    const input = getByPlaceholderText('Enter task title...')
    const submitButton = getByText('Add Task')
    
    // Submit empty form to show error
    await user.click(submitButton)
    expect(getByText('Task title is required')).toBeInTheDocument()
    
    // Start typing to clear error
    await user.type(input, 'T')
    expect(queryByText('Task title is required')).not.toBeInTheDocument()
  })
})

