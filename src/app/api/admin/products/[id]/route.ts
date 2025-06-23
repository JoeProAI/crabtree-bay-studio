import { NextRequest, NextResponse } from 'next/server'
import { ProductService, ProductInput } from '@/lib/supabase-admin'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const productData: Partial<ProductInput> = await request.json()
    const product = await ProductService.updateProduct(params.id, productData)
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    await ProductService.deleteProduct(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' }, 
      { status: 500 }
    )
  }
}
