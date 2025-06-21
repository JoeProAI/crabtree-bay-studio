export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  status: 'active' | 'inactive' | 'draft'
  featured: boolean
  inventory_count?: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface User {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'customer'
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  stripe_payment_intent_id?: string
  shipping_address: Address
  billing_address: Address
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  product_id: string
  product: Product
  quantity: number
  price: number
}

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface NewsletterSubscription {
  email: string
  subscribed_at: string
}