import { requireUser } from '@/lib/guards'

// Mock the auth module before importing
jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(),
}))

const { getCurrentUser } = require('@/lib/auth')

describe('Guards - requireUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return user when user is authenticated', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'USER',
    }

    getCurrentUser.mockResolvedValue(mockUser)

    const user = await requireUser()
    expect(user).toEqual(mockUser)
    expect(getCurrentUser).toHaveBeenCalledTimes(1)
  })

  it('should throw error when user is not authenticated', async () => {
    getCurrentUser.mockResolvedValue(null)

    await expect(requireUser()).rejects.toThrow('Unauthorized')
    expect(getCurrentUser).toHaveBeenCalledTimes(1)
  })

  it('should throw error when getCurrentUser throws', async () => {
    const error = new Error('Auth service error')
    getCurrentUser.mockRejectedValue(error)

    await expect(requireUser()).rejects.toThrow('Auth service error')
    expect(getCurrentUser).toHaveBeenCalledTimes(1)
  })
})
