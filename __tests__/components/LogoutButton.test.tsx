import { render, screen, fireEvent } from '@testing-library/react'
import { signOut } from 'next-auth/react'
import { LogoutButton } from '@/components/LogoutButton'

jest.mock('next-auth/react')

const mockSignOut = signOut as jest.MockedFunction<typeof signOut>

describe('LogoutButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render logout button', () => {
    render(<LogoutButton />)
    const button = screen.getByRole('button', { name: /logout/i })
    expect(button).toBeInTheDocument()
  })

  it('should call signOut when button is clicked', () => {
    mockSignOut.mockResolvedValue(undefined)

    render(<LogoutButton />)
    const button = screen.getByRole('button', { name: /logout/i })

    fireEvent.click(button)

    expect(mockSignOut).toHaveBeenCalledWith({
      callbackUrl: '/login',
    })
  })

  it('should have correct text content', () => {
    render(<LogoutButton />)
    const button = screen.getByRole('button')
    expect(button.textContent).toBe('Logout')
  })
})
