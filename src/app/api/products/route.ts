import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    
    let products
    
    if (featured === 'true') {
      products = await ProductService.getFeaturedProducts()
    } else {
      products = await ProductService.getActiveProducts()
    }
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
