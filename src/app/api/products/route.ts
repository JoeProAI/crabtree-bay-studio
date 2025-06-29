import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  console.log('🔍 API: /api/products request received')
  
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    
    console.log(`📝 Query params: featured=${featured}, category=${category}`)
    console.log('🔄 Checking Supabase connection...')
    
    // Verify environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('🔐 Supabase URL exists:', !!supabaseUrl)
    console.log('🔑 Supabase Anon Key exists:', !!supabaseAnonKey)
    
    // Get products based on parameters
    let products
    
    if (featured === 'true') {
      console.log('🌟 Fetching featured products')
      products = await ProductService.getFeaturedProducts()
    } else {
      console.log('📦 Fetching all active products')
      products = await ProductService.getActiveProducts()
    }
    
    // Log success and return products
    console.log(`✅ Successfully fetched ${products.length} products`)
    
    return NextResponse.json({
      success: true,
      count: products.length,
      products: products
    })
    
  } catch (error: any) {
    console.error('❌ GET /api/products error:', error)
    
    // Detailed error response
    const errorMessage = error?.message || 'Unknown error'
    const errorDetails = error?.stack || ''
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
