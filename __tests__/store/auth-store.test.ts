import { useAuthStore } from '@/store/auth-store'
import { act } from '@testing-library/react'

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useAuthStore.getState().logout()
    })
  })

  it('should have initial state', () => {
    const state = useAuthStore.getState()

    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.currentLocation).toBeNull()
  })

  it('should set user and update isAuthenticated', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    }

    act(() => {
      useAuthStore.getState().setUser(mockUser)
    })

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should set token', () => {
    const mockToken = 'mock-jwt-token'

    act(() => {
      useAuthStore.getState().setToken(mockToken)
    })

    const state = useAuthStore.getState()
    expect(state.token).toBe(mockToken)
  })

  it('should set location', () => {
    const mockLocation = {
      latitude: 37.7749,
      longitude: -122.4194,
    }

    act(() => {
      useAuthStore.getState().setLocation(mockLocation)
    })

    const state = useAuthStore.getState()
    expect(state.currentLocation).toEqual(mockLocation)
  })

  it('should logout and clear all state', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    }
    const mockToken = 'mock-jwt-token'
    const mockLocation = {
      latitude: 37.7749,
      longitude: -122.4194,
    }

    // Set all values
    act(() => {
      useAuthStore.getState().setUser(mockUser)
      useAuthStore.getState().setToken(mockToken)
      useAuthStore.getState().setLocation(mockLocation)
    })

    // Verify they are set
    let state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(state.currentLocation).toEqual(mockLocation)
    expect(state.isAuthenticated).toBe(true)

    // Logout
    act(() => {
      useAuthStore.getState().logout()
    })

    // Verify everything is cleared
    state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.currentLocation).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should set isAuthenticated to false when user is null', () => {
    act(() => {
      useAuthStore.getState().setUser(null)
    })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
  })
})
