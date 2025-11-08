/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

/**
 * Check if current location is within allowed radius
 * @param currentLat - Current latitude
 * @param currentLon - Current longitude
 * @param allowedLat - Allowed latitude
 * @param allowedLon - Allowed longitude
 * @param radius - Allowed radius in meters
 * @returns True if within radius, false otherwise
 */
export function isWithinAllowedArea(
  currentLat: number,
  currentLon: number,
  allowedLat: number,
  allowedLon: number,
  radius: number
): boolean {
  const distance = calculateDistance(currentLat, currentLon, allowedLat, allowedLon)
  return distance <= radius
}
