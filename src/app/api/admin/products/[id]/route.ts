import { NextRequest, NextResponse } from 'next/server'
import { ProductService, ProductInput } from '@/lib/supabase-admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productData: Partial<ProductInput> = await request.json()
    const product = await ProductService.updateProduct(params.id, productData)
    return NextResponse.json(product)
  } catch (error) {
    console.error('PUT /api/admin/products/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ProductService.deleteProduct(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/products/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
