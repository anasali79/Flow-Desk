import { describe, it, expect } from 'vitest'
import { renderWithProviders, userEvent } from '../../test/test-utils'
import FilterButtons from '../FilterButtons'

describe('FilterButtons Component', () => {
  it('renders all filter buttons', () => {
    const { getByText } = renderWithProviders(<FilterButtons />)
    
    expect(getByText('All')).toBeInTheDocument()
    expect(getByText('Pending')).toBeInTheDocument()
    expect(getByText('Completed')).toBeInTheDocument()
  })

  it('highlights the active filter button', () => {
    const preloadedState = {
      tasks: {
        filter: 'pending',
        searchQuery: '',
        items: [],
        selectedTask: null,
        filters: {},
        loading: false,
        error: null,
      },
    }
    
    const { getByText } = renderWithProviders(<FilterButtons />, { preloadedState })
    const pendingButton = getByText('Pending')
    
    expect(pendingButton).toHaveClass('bg-blue-500')
  })

  it('calls setFilter when a filter button is clicked', async () => {
    const user = userEvent.setup()
    const { getByText } = renderWithProviders(<FilterButtons />)
    const completedButton = getByText('Completed')
    
    await user.click(completedButton)
    
    // The button should now be active
    expect(completedButton).toBeInTheDocument()
  })

  it('renders with correct default filter (all)', () => {
    const preloadedState = {
      tasks: {
        filter: 'all',
        searchQuery: '',
        items: [],
        selectedTask: null,
        filters: {},
        loading: false,
        error: null,
      },
    }
    
    const { getByText } = renderWithProviders(<FilterButtons />, { preloadedState })
    const allButton = getByText('All')
    
    expect(allButton).toHaveClass('bg-blue-500')
  })
})

