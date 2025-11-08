import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'
import { isWithinAllowedArea } from '@/lib/location'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, latitude, longitude } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check location if required
    if (user.allowedLatitude && user.allowedLongitude && latitude && longitude) {
      const isAllowed = isWithinAllowedArea(
        latitude,
        longitude,
        user.allowedLatitude,
        user.allowedLongitude,
        user.allowedRadius
      )

      if (!isAllowed) {
        return NextResponse.json(
          { error: 'You are not in the allowed location to access this account' },
          { status: 403 }
        )
      }
    } else if (user.allowedLatitude && user.allowedLongitude && (!latitude || !longitude)) {
      return NextResponse.json(
        { error: 'Location is required for this account' },
        { status: 400 }
      )
    }

    // Generate JWT token
    const token = signToken({ userId: user.id, email: user.email })

    // Create session
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        latitude: latitude || null,
        longitude: longitude || null,
        expiresAt,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          allowedLatitude: user.allowedLatitude,
          allowedLongitude: user.allowedLongitude,
          allowedRadius: user.allowedRadius,
        },
        token,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
