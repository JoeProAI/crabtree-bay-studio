import { createClient } from '@supabase/supabase-js'
import { Product } from '@/types'

// Function to get admin client - called at runtime, not build time
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('🔍 Supabase Admin Debug:')
  console.log('- URL exists:', !!supabaseUrl)
  console.log('- Service key exists:', !!supabaseServiceKey)
  console.log('- URL value:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'undefined')
  console.log('- All env vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')))

  if (!supabaseUrl || !supabaseServiceKey) {
    const errorMsg = `Missing Supabase environment variables: URL=${!!supabaseUrl}, Key=${!!supabaseServiceKey}`
    console.error('❌ SUPABASE ERROR:', errorMsg)
    throw new Error(errorMsg)
  }

  try {
    return createClient(supabaseUrl, supabaseServiceKey)
  } catch (error) {
    console.error('❌ SUPABASE CLIENT ERROR:', error)
    throw error
  }
}

export interface ProductInput {
  name: string
  description: string
  price: number
  image_url: string
  category: string
  status: 'active' | 'inactive'
  featured: boolean
  inventory_count: number
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
    console.log('🛍️ Creating new product with data:', JSON.stringify(productData, null, 2))
    
    const supabaseAdmin = getSupabaseAdmin()
    
    try {
      // Add timestamp fields
      const productWithTimestamp = {
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('📝 Inserting product into database...')
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert([productWithTimestamp])
        .select()
        .single()

      if (error) {
        console.error('❌ Database insert error:', error)
        console.error('❌ Error details:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to create product: ${error.message}`)
      }

      console.log('✅ Product created successfully:', data)
      return data
    } catch (error) {
      console.error('💥 Product creation failed:', error)
      throw error
    }
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
      throw new Error('Failed to fetch product')
    }

    // Toggle the featured status
    const newFeaturedStatus = !product.featured
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ 
        featured: newFeaturedStatus,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error toggling featured status:', error)
      throw new Error('Failed to toggle featured status')
    }

    return data
  }

  // Decrement stock when item is purchased
  static async decrementStock(id: string, quantity: number = 1): Promise<Product> {
    const supabaseAdmin = getSupabaseAdmin()
    
    // First get current stock
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('inventory_count')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching product stock:', fetchError)
      throw new Error('Failed to fetch product stock')
    }

    const currentStock = product.inventory_count || 0
    const newStock = Math.max(0, currentStock - quantity)

    // Update stock
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ 
        inventory_count: newStock,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating stock:', error)
      throw new Error('Failed to update stock')
    }

    return data
  }

  // Check if product is in stock
  static async isInStock(id: string, requestedQuantity: number = 1): Promise<boolean> {
    const supabaseAdmin = getSupabaseAdmin()
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('inventory_count')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error checking stock:', error)
      return false
    }

    return (product.inventory_count || 0) >= requestedQuantity
  }

  // Upload product image to Supabase Storage
  static async uploadProductImage(file: File): Promise<string> {
    console.log('🔄 Starting image upload for file:', file.name, 'Size:', file.size, 'Type:', file.type)
    
    const supabaseAdmin = getSupabaseAdmin()
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `product-images/${fileName}`
    
    console.log('📁 Upload path:', filePath)
    
    try {
      // First, check if the bucket exists by trying to list files
      console.log('🔍 Checking if storage bucket "products" exists...')
      const { data: bucketCheck, error: bucketError } = await supabaseAdmin
        .storage
        .from('products')
        .list('', { limit: 1 })
      
      if (bucketError) {
        console.error('❌ Storage bucket "products" error:', bucketError)
        console.log('🔧 Attempting to create bucket...')
        
        // Try to create the bucket
        const { error: createError } = await supabaseAdmin
          .storage
          .createBucket('products', {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            fileSizeLimit: 5242880 // 5MB
          })
        
        if (createError) {
          console.error('❌ Failed to create bucket:', createError)
          throw new Error(`Storage bucket creation failed: ${createError.message}`)
        }
        
        console.log('✅ Storage bucket "products" created successfully')
      } else {
        console.log('✅ Storage bucket "products" exists')
      }
      
      // Upload the file
      console.log('📤 Uploading file to storage...')
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        console.error('❌ Upload error:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }
      
      console.log('✅ File uploaded successfully:', uploadData)
      
      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('products')
        .getPublicUrl(filePath)
      
      console.log('🔗 Generated public URL:', publicUrl)
      
      return publicUrl
    } catch (error) {
      console.error('💥 Image upload failed with error:', error)
      throw error
    }
  }
}
