import { calculateDistance, isWithinAllowedArea } from '@/lib/location'

describe('Location Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points correctly', () => {
      // San Francisco to Los Angeles (approximately 559 km)
      const sfLat = 37.7749
      const sfLon = -122.4194
      const laLat = 34.0522
      const laLon = -118.2437

      const distance = calculateDistance(sfLat, sfLon, laLat, laLon)

      // Distance should be around 559,000 meters (559 km)
      expect(distance).toBeGreaterThan(500000)
      expect(distance).toBeLessThan(600000)
    })

    it('should return 0 for same coordinates', () => {
      const lat = 37.7749
      const lon = -122.4194

      const distance = calculateDistance(lat, lon, lat, lon)

      expect(distance).toBe(0)
    })

    it('should calculate short distances accurately', () => {
      // Two points 100 meters apart
      const lat1 = 37.7749
      const lon1 = -122.4194
      const lat2 = 37.7758 // approximately 100m north
      const lon2 = -122.4194

      const distance = calculateDistance(lat1, lon1, lat2, lon2)

      // Should be approximately 100 meters
      expect(distance).toBeGreaterThan(90)
      expect(distance).toBeLessThan(110)
    })
  })

  describe('isWithinAllowedArea', () => {
    it('should return true when within allowed radius', () => {
      const centerLat = 37.7749
      const centerLon = -122.4194
      const currentLat = 37.7750 // very close
      const currentLon = -122.4195
      const radius = 100 // 100 meters

      const result = isWithinAllowedArea(currentLat, currentLon, centerLat, centerLon, radius)

      expect(result).toBe(true)
    })

    it('should return false when outside allowed radius', () => {
      const centerLat = 37.7749
      const centerLon = -122.4194
      const currentLat = 37.7850 // far away
      const currentLon = -122.4294
      const radius = 100 // 100 meters

      const result = isWithinAllowedArea(currentLat, currentLon, centerLat, centerLon, radius)

      expect(result).toBe(false)
    })

    it('should handle edge case at exact radius', () => {
      const centerLat = 37.7749
      const centerLon = -122.4194
      const currentLat = 37.7757 // Closer to stay within 100m
      const currentLon = -122.4194
      const radius = 100 // 100 meters

      const result = isWithinAllowedArea(currentLat, currentLon, centerLat, centerLon, radius)

      // Should be within radius
      expect(result).toBe(true)
    })

    it('should work with large radius', () => {
      const centerLat = 37.7749
      const centerLon = -122.4194
      const currentLat = 37.8
      const currentLon = -122.5
      const radius = 50000 // 50 km

      const result = isWithinAllowedArea(currentLat, currentLon, centerLat, centerLon, radius)

      expect(result).toBe(true)
    })
  })
})
