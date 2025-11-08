import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { isWithinAllowedArea } from '@/lib/location'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Verify JWT
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { latitude, longitude } = body

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has allowed location set
    if (!user.allowedLatitude || !user.allowedLongitude) {
      return NextResponse.json(
        {
          isValid: true,
          message: 'No location restriction set for this user'
        },
        { status: 200 }
      )
    }

    // Validate location
    const isValid = isWithinAllowedArea(
      latitude,
      longitude,
      user.allowedLatitude,
      user.allowedLongitude,
      user.allowedRadius
    )

    if (!isValid) {
      // Log user out by deleting all their sessions
      await prisma.session.deleteMany({
        where: { userId: user.id },
      })

      return NextResponse.json(
        {
          isValid: false,
          error: 'You have moved outside the allowed area. Please log in again from an allowed location.',
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        isValid: true,
        message: 'Location is valid'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Location validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
