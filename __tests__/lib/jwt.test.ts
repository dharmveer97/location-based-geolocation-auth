import { signToken, verifyToken } from '@/lib/jwt'

describe('JWT Utils', () => {
  const mockPayload = {
    userId: '123',
    email: 'test@example.com',
  }

  describe('signToken', () => {
    it('should generate a valid JWT token', () => {
      const token = signToken(mockPayload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should generate different tokens for different payloads', () => {
      const payload1 = { userId: '123', email: 'user1@example.com' }
      const payload2 = { userId: '456', email: 'user2@example.com' }

      const token1 = signToken(payload1)
      const token2 = signToken(payload2)

      // Tokens should be different for different payloads
      expect(token1).not.toBe(token2)
    })
  })

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const token = signToken(mockPayload)
      const decoded = verifyToken(token)

      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(mockPayload.userId)
      expect(decoded?.email).toBe(mockPayload.email)
    })

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid.token.here')

      expect(decoded).toBeNull()
    })

    it('should return null for malformed token', () => {
      const decoded = verifyToken('not-a-jwt-token')

      expect(decoded).toBeNull()
    })

    it('should return null for empty token', () => {
      const decoded = verifyToken('')

      expect(decoded).toBeNull()
    })
  })

  describe('Token lifecycle', () => {
    it('should sign and verify token correctly', () => {
      const payload = {
        userId: 'user-456',
        email: 'user@test.com',
      }

      const token = signToken(payload)
      const decoded = verifyToken(token)

      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(payload.userId)
      expect(decoded?.email).toBe(payload.email)
    })
  })
})
