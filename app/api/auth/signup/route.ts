import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, latitude, longitude } = body

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with optional location
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        allowedLatitude: latitude || null,
        allowedLongitude: longitude || null,
        allowedRadius: parseFloat(process.env['ALLOWED_RADIUS'] || '100'),
      },
    })

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
        },
        token,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
