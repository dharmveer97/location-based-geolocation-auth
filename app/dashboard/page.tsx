"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "@/hooks/use-toast"
import { MapPin, LogOut, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, token, isAuthenticated, currentLocation, setLocation, logout } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [locationCheckInterval, setLocationCheckInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      router.push("/login")
      return
    }

    // Verify token with server
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          logout()
          router.push("/login")
          return
        }

        setLoading(false)
      } catch {
        logout()
        router.push("/login")
      }
    }

    verifyAuth()

    // Start location tracking
    startLocationTracking()

    return () => {
      if (locationCheckInterval) {
        clearInterval(locationCheckInterval)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token])

  const startLocationTracking = () => {
    // Check location every 30 seconds
    const interval = setInterval(() => {
      checkLocation()
    }, 30000)

    setLocationCheckInterval(interval)

    // Initial check
    checkLocation()
  }

  const checkLocation = async () => {
    if (!token) {
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
        })
      })

      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

      setLocation({ latitude, longitude })

      // Validate location with server
      const response = await fetch("/api/location/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude, longitude }),
      })

      const data = await response.json()

      if (!response.ok || !data.isValid) {
        toast({
          title: "Location Error",
          description: data.error || "You have moved outside the allowed area",
          variant: "destructive",
        })

        // Log out user
        setTimeout(() => {
          logout()
          router.push("/login")
        }, 3000)
      }
    } catch (error) {
      console.warn("Location check failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      logout()
      router.push("/login")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Current Location
              </CardTitle>
              <CardDescription>Your current geographical position</CardDescription>
            </CardHeader>
            <CardContent>
              {currentLocation ? (
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Latitude:</span>{" "}
                    {currentLocation.latitude.toFixed(6)}
                  </div>
                  <div>
                    <span className="font-semibold">Longitude:</span>{" "}
                    {currentLocation.longitude.toFixed(6)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Location is checked every 30 seconds to ensure you&apos;re in the allowed area.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Getting location...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Security Notice
              </CardTitle>
              <CardDescription>Important information about your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  Your account is protected with location-based authentication. If you move outside your allowed area, you will be automatically logged out.
                </p>
                <p className="text-muted-foreground">
                  To ensure continuous access, stay within the location you registered from.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Name:</span> {user?.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {user?.email}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
