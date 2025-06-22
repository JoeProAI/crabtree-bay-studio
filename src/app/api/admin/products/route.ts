import { NextRequest, NextResponse } from 'next/server'
import { ProductService, ProductInput } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const products = await ProductService.getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('GET /api/admin/products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData: ProductInput = await request.json()
    
    // Validate required fields
    if (!productData.name || !productData.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    const product = await ProductService.createProduct(productData)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/products error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
