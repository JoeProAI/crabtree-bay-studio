import { createClient } from '@supabase/supabase-js'
import { Product } from '@/types'

// Function to get admin client - called at runtime, not build time
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

export interface ProductInput {
  name: string
  description: string
  price: number
  image_url: string
  category: string
  status: 'active' | 'inactive'
  featured: boolean
}

export class ProductService {
  // Get all products
  static async getAllProducts(): Promise<Product[]> {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }

    return data || []
  }

  // Get active products only
  static async getActiveProducts(): Promise<Product[]> {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching active products:', error)
      throw new Error('Failed to fetch active products')
    }

    return data || []
  }

  // Get featured products
  static async getFeaturedProducts(): Promise<Product[]> {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('status', 'active')
      .eq('featured', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching featured products:', error)
      throw new Error('Failed to fetch featured products')
    }

    return data || []
  }

  // Create a new product
  static async createProduct(productData: ProductInput): Promise<Product> {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw new Error('Failed to create product')
    }

    return data
  }

  // Update a product
  static async updateProduct(id: string, productData: Partial<ProductInput>): Promise<Product> {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw new Error('Failed to update product')
    }

    return data
  }

  // Delete a product
  static async deleteProduct(id: string): Promise<void> {
    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw new Error('Failed to delete product')
    }
  }

  // Toggle product status
  static async toggleProductStatus(id: string): Promise<Product> {
    // First get the current status
    const supabaseAdmin = getSupabaseAdmin()
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('status')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching product status:', fetchError)
      throw new Error('Failed to fetch product status')
    }

    const newStatus = product.status === 'active' ? 'inactive' : 'active'

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error toggling product status:', error)
      throw new Error('Failed to toggle product status')
    }

    return data
  }

  // Toggle featured status
  static async toggleFeatured(id: string): Promise<Product> {
    // First get the current featured status
    const supabaseAdmin = getSupabaseAdmin()
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('featured')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching product featured status:', fetchError)
      throw new Error('Failed to fetch product featured status')
    }

    const newFeatured = !product.featured

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ featured: newFeatured, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error toggling featured status:', error)
      throw new Error('Failed to toggle featured status')
    }

    return data
  }
}
