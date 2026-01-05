import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, userEvent } from '../../test/test-utils'
import EditTask from '../EditTask'

// Mock the Redux action but keep the reducer
vi.mock('../../store/taskSlice', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    updateTask: vi.fn(({ id, updates }) => ({
      type: 'tasks/updateTask',
      payload: { id, updates },
    })),
  }
})

describe('EditTask Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    status: 'pending',
    stage: 'Not started',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with task title pre-filled', () => {
    const { getByDisplayValue } = renderWithProviders(
      <EditTask task={mockTask} onCancel={vi.fn()} onSave={vi.fn()} />
    )
    
    expect(getByDisplayValue('Test Task')).toBeInTheDocument()
  })

  it('allows user to edit task title', async () => {
    const user = userEvent.setup()
    const { getByDisplayValue } = renderWithProviders(
      <EditTask task={mockTask} onCancel={vi.fn()} onSave={vi.fn()} />
    )
    
    const input = getByDisplayValue('Test Task')
    await user.clear(input)
    await user.type(input, 'Updated Task')
    
    expect(input).toHaveValue('Updated Task')
  })

  it('shows error when submitting empty title', async () => {
    const user = userEvent.setup()
    const { getByDisplayValue, getByText } = renderWithProviders(
      <EditTask task={mockTask} onCancel={vi.fn()} onSave={vi.fn()} />
    )
    
    const input = getByDisplayValue('Test Task')
    await user.clear(input)
    
    const saveButton = getByText('Save')
    await user.click(saveButton)
    
    expect(getByText('Task title is required')).toBeInTheDocument()
  })

  it('calls onSave when form is submitted with valid title', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const { getByDisplayValue, getByText } = renderWithProviders(
      <EditTask task={mockTask} onCancel={vi.fn()} onSave={onSave} />
    )
    
    const input = getByDisplayValue('Test Task')
    await user.clear(input)
    await user.type(input, 'Updated Task')
    
    const saveButton = getByText('Save')
    await user.click(saveButton)
    
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const { getByText } = renderWithProviders(
      <EditTask task={mockTask} onCancel={onCancel} onSave={vi.fn()} />
    )
    
    const cancelButton = getByText('Cancel')
    await user.click(cancelButton)
    
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('renders stage dropdown with correct value', () => {
    const { getByDisplayValue } = renderWithProviders(
      <EditTask task={mockTask} onCancel={vi.fn()} onSave={vi.fn()} />
    )
    
    expect(getByDisplayValue('Not started')).toBeInTheDocument()
  })
})

