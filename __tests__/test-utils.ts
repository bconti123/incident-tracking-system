/**
 * Testing Utilities and Helpers
 * 
 * This file contains common utilities and factories for testing
 * to promote DRY (Don't Repeat Yourself) principles
 */

import { Role } from '@/types/rbac'

/**
 * User Factory - creates mock user objects for testing
 */
export const createMockUser = (overrides = {}) => {
  return {
    id: 'user-1',
    email: 'test@example.com',
    role: 'USER' as Role,
    name: 'Test User',
    ...overrides,
  }
}

/**
 * Ticket Factory - creates mock ticket objects for testing
 */
export const createMockTicket = (overrides = {}) => {
  return {
    id: 'ticket-1',
    title: 'Test Ticket',
    description: 'Test Description',
    status: 'OPEN' as const,
    priority: 'MEDIUM' as const,
    ownerId: 'user-1',
    assignedToId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

/**
 * Comment Factory - creates mock comment objects for testing
 */
export const createMockComment = (overrides = {}) => {
  return {
    id: 'comment-1',
    content: 'Test comment',
    ticketId: 'ticket-1',
    authorId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

/**
 * AuditLog Factory - creates mock audit log objects for testing
 */
export const createMockAuditLog = (overrides = {}) => {
  return {
    id: 'log-1',
    action: 'TICKET_CREATED' as const,
    actorId: 'user-1',
    ticketId: 'ticket-1',
    entityType: 'Ticket',
    entityId: 'ticket-1',
    beforeJson: null,
    afterJson: { status: 'OPEN' },
    createdAt: new Date(),
    ...overrides,
  }
}

/**
 * Test Data Sets
 */
export const TEST_USERS = {
  admin: createMockUser({ id: 'admin-1', role: 'ADMIN', email: 'admin@example.com' }),
  support: createMockUser({ id: 'support-1', role: 'SUPPORT', email: 'support@example.com' }),
  user: createMockUser({ id: 'user-1', role: 'USER', email: 'user@example.com' }),
}

export const TEST_TICKETS = {
  open: createMockTicket({ status: 'OPEN', priority: 'HIGH' }),
  inProgress: createMockTicket({ id: 'ticket-2', status: 'IN_PROGRESS' }),
  resolved: createMockTicket({ id: 'ticket-3', status: 'RESOLVED' }),
  blocked: createMockTicket({ id: 'ticket-4', status: 'BLOCKED' }),
}

/**
 * Async Test Helpers
 */

/**
 * Wait for a condition to be true (useful for async operations)
 */
export const waitFor = async (
  condition: () => boolean,
  timeout = 1000,
  interval = 50
): Promise<void> => {
  const startTime = Date.now()
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('waitFor timeout exceeded')
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }
}

/**
 * Mock FormData for server action testing
 */
export const createMockFormData = (data: Record<string, string | null>) => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, value)
    }
  })
  return formData
}

/**
 * Role Test Data
 */
export const ALL_ROLES: Role[] = ['ADMIN', 'SUPPORT', 'USER']

/**
 * Status/Priority Test Data
 */
export const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'BLOCKED'] as const
export const TICKET_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const
