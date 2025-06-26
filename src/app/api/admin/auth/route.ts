import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Use only environment variable - no hardcoded fallback for security
    const adminPassword = process.env.ADMIN_PASSWORD
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    console.log('Admin auth attempt')
    
    if (password === adminPassword) {
      console.log('Admin authentication successful')
      return NextResponse.json({ success: true })
    } else {
      console.log('Admin authentication failed - invalid password')
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
