import {
  canViewAllTickets,
  canCreateTicket,
  canUpdateTicket,
  canViewTicket,
} from '@/lib/rbac'
import { Role, UserLike, TicketLike } from '@/types/rbac'

describe('RBAC - canViewAllTickets', () => {
  it('should return true for ADMIN', () => {
    const result = canViewAllTickets('ADMIN')
    expect(result).toBe(true)
  })

  it('should return true for SUPPORT', () => {
    const result = canViewAllTickets('SUPPORT')
    expect(result).toBe(true)
  })

  it('should return false for USER', () => {
    const result = canViewAllTickets('USER')
    expect(result).toBe(false)
  })
})

describe('RBAC - canCreateTicket', () => {
  it('should return true for ADMIN', () => {
    const result = canCreateTicket('ADMIN')
    expect(result).toBe(true)
  })

  it('should return true for USER', () => {
    const result = canCreateTicket('USER')
    expect(result).toBe(true)
  })

  it('should return false for SUPPORT', () => {
    const result = canCreateTicket('SUPPORT')
    expect(result).toBe(false)
  })
})

describe('RBAC - canUpdateTicket', () => {
  it('should return true for ADMIN', () => {
    const result = canUpdateTicket('ADMIN')
    expect(result).toBe(true)
  })

  it('should return true for SUPPORT', () => {
    const result = canUpdateTicket('SUPPORT')
    expect(result).toBe(true)
  })

  it('should return false for USER', () => {
    const result = canUpdateTicket('USER')
    expect(result).toBe(false)
  })
})

describe('RBAC - canViewTicket', () => {
  const adminUser: UserLike = {
    id: '1',
    role: 'ADMIN',
  }

  const supportUser: UserLike = {
    id: '2',
    role: 'SUPPORT',
  }

  const regularUser: UserLike = {
    id: '3',
    role: 'USER',
  }

  const ticket: TicketLike = {
    ownerId: '3',
  }

  const otherTicket: TicketLike = {
    ownerId: '999',
  }

  it('should allow ADMIN to view any ticket', () => {
    expect(canViewTicket(adminUser, ticket)).toBe(true)
    expect(canViewTicket(adminUser, otherTicket)).toBe(true)
  })

  it('should allow SUPPORT to view any ticket', () => {
    expect(canViewTicket(supportUser, ticket)).toBe(true)
    expect(canViewTicket(supportUser, otherTicket)).toBe(true)
  })

  it('should allow USER to view only their own tickets', () => {
    expect(canViewTicket(regularUser, ticket)).toBe(true)
    expect(canViewTicket(regularUser, otherTicket)).toBe(false)
  })
})
