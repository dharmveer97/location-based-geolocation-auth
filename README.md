# Location Auth 🔐

A production-ready, location-based authentication system built with Next.js 15, PostgreSQL, and modern web technologies. Restrict user access based on geographical location - perfect for office-only access, geo-fenced applications, and location-sensitive services.

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and install dependencies:**

```bash
git clone <your-repo-url>
cd location-auth
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and update:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/location_auth?schema=public"
JWT_SECRET="your-secure-jwt-secret-here"
```

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Create PostgreSQL database:**

```bash
createdb location_auth
```

Or using psql:

```bash
psql -U postgres -c "CREATE DATABASE location_auth;"
```

4. **Run database migrations:**

```bash
npm run db:migrate
```

5. **Start the development server:**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Features

### 🔐 Authentication
- Secure JWT-based authentication
- Password encryption with bcrypt
- Session management with automatic expiration
- Protected routes and API endpoints

### 📍 Location-Based Access
- Real-time location tracking using browser Geolocation API
- Automatic validation every 30 seconds
- Configurable radius (default: 100 meters)
- Haversine formula for accurate distance calculation
- Auto-logout when user moves outside allowed area

### 🎨 Modern UI
- Built with Shadcn UI components
- Responsive design with Tailwind CSS
- Toast notifications for user feedback
- Clean, accessible interface

### 💾 State Management
- Zustand for global state
- Persistent storage for user sessions
- Optimized re-renders

### 🧪 Testing
- Jest + React Testing Library
- Unit tests for utilities and components
- Coverage reports
- CI-ready test suite

### 🔧 Developer Experience
- Strict TypeScript configuration
- ESLint with Next.js best practices
- Hot reload in development
- Comprehensive error handling

## Project Structure

```
location-auth/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── signup/
│   │   │   └── verify/
│   │   └── location/        # Location validation
│   │       └── validate/
│   ├── dashboard/           # Protected dashboard page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   └── ui/                  # Shadcn UI components
├── lib/                     # Utility functions
│   ├── jwt.ts              # JWT utilities
│   ├── location.ts         # Location calculations
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # General utilities
├── store/                   # Zustand stores
│   └── auth-store.ts       # Authentication state
├── prisma/                  # Database schema
│   └── schema.prisma       # Prisma schema
└── __tests__/              # Test files
    ├── components/
    ├── lib/
    └── store/
```

## API Endpoints

### Authentication

#### POST `/api/auth/signup`

Create a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

#### POST `/api/auth/login`

Authenticate and receive a JWT token.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "allowedLatitude": 37.7749,
    "allowedLongitude": -122.4194,
    "allowedRadius": 100
  },
  "token": "jwt-token"
}
```

#### POST `/api/auth/logout`

Invalidate the current session.

**Headers:**

```
Authorization: Bearer <token>
```

#### GET `/api/auth/verify`

Verify token validity and get user info.

**Headers:**

```
Authorization: Bearer <token>
```

### Location

#### POST `/api/location/validate`

Validate current location against allowed area.

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "latitude": 37.7750,
  "longitude": -122.4195
}
```

**Response:**

```json
{
  "isValid": true,
  "message": "Location is valid"
}
```

## Database Schema

### User

```prisma
model User {
  id                String    @id @default(uuid())
  email             String    @unique
  name              String
  password          String
  allowedLatitude   Float?
  allowedLongitude  Float?
  allowedRadius     Float     @default(100)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  sessions          Session[]
}
```

### Session

```prisma
model Session {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  latitude  Float?
  longitude Float?
  createdAt DateTime @default(now())
  expiresAt DateTime
}
```

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:push          # Push schema to database

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # Run TypeScript checks

# Testing
npm run test             # Run tests in watch mode
npm run test:ci          # Run tests once
npm run test:coverage    # Generate coverage report
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/location_auth"

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET="your-super-secret-jwt-key"

# Location Settings
ALLOWED_RADIUS=100

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## How It Works

### Signup Flow

1. User provides email, password, and name
2. Optionally enables location-based authentication
3. If enabled, browser requests location permission
4. Current location is saved as the allowed area
5. Password is hashed with bcrypt
6. User record is created in database
7. JWT token is generated and session created
8. User is redirected to dashboard

### Login Flow

1. User provides email and password
2. System retrieves location (if required)
3. Credentials are verified
4. Location is checked against allowed area
5. If valid, JWT token is generated
6. Session is created with location data
7. User gains access to protected routes

### Location Monitoring

1. Dashboard requests location every 30 seconds
2. Location is sent to `/api/location/validate`
3. Server calculates distance from allowed point
4. If distance exceeds radius, session is invalidated
5. User is automatically logged out
6. Toast notification alerts the user

## Security Best Practices

### Implemented

✅ Passwords hashed with bcrypt (10 rounds)
✅ JWT tokens with 7-day expiration
✅ HTTPS enforcement (configure in production)
✅ Environment variable validation
✅ SQL injection protection (Prisma ORM)
✅ XSS protection (React escaping)
✅ Session invalidation on logout
✅ Strict TypeScript configuration

### Recommended for Production

- [ ] Rate limiting on API routes
- [ ] CORS configuration
- [ ] HTTP security headers
- [ ] Database connection pooling
- [ ] Error monitoring (Sentry, etc.)
- [ ] Logging infrastructure
- [ ] Regular security audits

## Testing

Run the test suite:

```bash
# Watch mode
npm run test

# Single run
npm run test:ci

# With coverage
npm run test:coverage
```

Tests cover:

- ✅ Location distance calculations
- ✅ JWT token signing and verification
- ✅ Auth store state management
- ✅ UI component rendering and interactions

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works on any platform supporting:

- Node.js 18+
- PostgreSQL database
- Environment variables

Examples: Railway, Render, Fly.io, AWS, Google Cloud

## Troubleshooting

### "Prisma Client not initialized"

```bash
npx prisma generate
```

### "Cannot connect to database"

1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Verify database exists

### Location not working

1. Use HTTPS (required in production)
2. Grant browser location permissions
3. Ensure device has GPS/location services

### Build errors

```bash
npm run type-check
npm run lint:fix
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test:ci`
5. Check types: `npm run type-check`
6. Submit a pull request

## License

MIT License - feel free to use in your projects!

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **State:** Zustand
- **UI:** Shadcn UI + Tailwind CSS
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint

## Verification

After setup, verify everything works:

```bash
npm run type-check    # ✓ TypeScript: No errors
npm run lint          # ✓ ESLint: No warnings
npm run test:ci       # ✓ Tests: 26/26 passing
```

## Support

For issues and questions:

- 📝 [Open an issue](https://github.com/your-username/location-auth/issues)
- 📖 [View documentation](https://github.com/your-username/location-auth/wiki)

---

Built with ❤️ using 100% open-source technologies
