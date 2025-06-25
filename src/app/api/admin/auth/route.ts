import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Temporary hardcoded password to bypass env issues
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    console.log('Admin auth attempt with password:', password)
    
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
