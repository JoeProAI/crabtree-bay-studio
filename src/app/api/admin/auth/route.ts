import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // Hash the provided password for comparison
    // In a real production app, you would use a proper password hashing library like bcrypt
    const hashedPassword = createHash('sha256').update(password).digest('hex')
    
    // Get the stored hashed password from env (should be pre-hashed)
    const storedHashedPassword = adminPassword
    
    if (hashedPassword === storedHashedPassword) {
      // Success - return a token or session identifier
      // In a real app, you would use a proper JWT or session management
      return NextResponse.json({ success: true })
    } else {
      // Failed authentication
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
