/**
 * Example test demonstrating the use of test utilities and factories
 * 
 * This shows best practices for organizing and reusing test code
 */

import {
  createMockUser,
  createMockTicket,
  TEST_USERS,
  TEST_TICKETS,
  ALL_ROLES,
  createMockFormData,
} from '@/__tests__/test-utils'
import { canViewTicket, canCreateTicket, canUpdateTicket } from '@/lib/rbac'

describe('Using Test Factories and Utilities', () => {
  describe('Creating mock objects with factories', () => {
    it('should create a user with default values', () => {
      const user = createMockUser()
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('role', 'USER')
    })

    it('should create a user with custom overrides', () => {
      const user = createMockUser({
        id: 'custom-user',
        role: 'ADMIN',
        email: 'admin@test.com',
      })
      expect(user.id).toBe('custom-user')
      expect(user.role).toBe('ADMIN')
      expect(user.email).toBe('admin@test.com')
    })

    it('should create a ticket with default values', () => {
      const ticket = createMockTicket()
      expect(ticket).toHaveProperty('title', 'Test Ticket')
      expect(ticket).toHaveProperty('status', 'OPEN')
    })

    it('should create a ticket with custom overrides', () => {
      const ticket = createMockTicket({
        id: 'urgent-ticket',
        priority: 'URGENT',
        assignedToId: 'support-1',
      })
      expect(ticket.id).toBe('urgent-ticket')
      expect(ticket.priority).toBe('URGENT')
      expect(ticket.assignedToId).toBe('support-1')
    })
  })

  describe('Using predefined test data sets', () => {
    it('should have all test user types', () => {
      expect(TEST_USERS).toHaveProperty('admin')
      expect(TEST_USERS).toHaveProperty('support')
      expect(TEST_USERS).toHaveProperty('user')
    })

    it('should have all test ticket statuses', () => {
      expect(TEST_TICKETS.open.status).toBe('OPEN')
      expect(TEST_TICKETS.inProgress.status).toBe('IN_PROGRESS')
      expect(TEST_TICKETS.resolved.status).toBe('RESOLVED')
      expect(TEST_TICKETS.blocked.status).toBe('BLOCKED')
    })

    it('should test RBAC permissions against all roles', () => {
      ALL_ROLES.forEach((role) => {
        const canCreate = canCreateTicket(role)
        // Verify that permission check works for each role
        expect(typeof canCreate).toBe('boolean')
      })
    })
  })

  describe('RBAC testing with factories', () => {
    it('should allow admin to view all tickets', () => {
      const admin = TEST_USERS.admin
      const ticket = TEST_TICKETS.open

      expect(canViewTicket(admin, ticket)).toBe(true)
    })

    it('should allow user to view their own tickets', () => {
      const user = createMockUser({ id: 'user-123' })
      const ticket = createMockTicket({ ownerId: 'user-123' })

      expect(canViewTicket(user, ticket)).toBe(true)
    })

    it('should prevent user from viewing others tickets', () => {
      const user = createMockUser({ id: 'user-123' })
      const otherTicket = createMockTicket({ ownerId: 'other-user' })

      expect(canViewTicket(user, otherTicket)).toBe(false)
    })

    it('should test permission matrix for different role combinations', () => {
      const testMatrix = [
        { role: 'ADMIN', canCreate: true, canUpdate: true },
        { role: 'SUPPORT', canCreate: false, canUpdate: true },
        { role: 'USER', canCreate: true, canUpdate: false },
      ]

      testMatrix.forEach(({ role, canCreate, canUpdate }) => {
        const user = createMockUser({ role: role as any })
        expect(canCreateTicket(user.role)).toBe(canCreate)
        expect(canUpdateTicket(user.role)).toBe(canUpdate)
      })
    })
  })

  describe('Form data testing', () => {
    it('should create mock FormData for server actions', () => {
      const formData = createMockFormData({
        title: 'New Ticket',
        description: 'A detailed description',
        priority: 'HIGH',
      })

      expect(formData.get('title')).toBe('New Ticket')
      expect(formData.get('description')).toBe('A detailed description')
      expect(formData.get('priority')).toBe('HIGH')
    })

    it('should handle null values in FormData', () => {
      const formData = createMockFormData({
        title: 'Ticket',
        assignedToId: null,
      })

      expect(formData.get('title')).toBe('Ticket')
      expect(formData.has('assignedToId')).toBe(false)
    })
  })
})
