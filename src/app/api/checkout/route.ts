import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { CartItem } from '@/types'
import { ProductService } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    // Initialize Stripe at runtime, not build time
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not found')
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-05-28.basil',
    })

    const { cartItems, successUrl, cancelUrl }: { cartItems: CartItem[], successUrl?: string, cancelUrl?: string } = await request.json()

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 })
    }

    // Check if all items are in stock
    for (const item of cartItems) {
      const inStock = await ProductService.isInStock(item.product.id, item.quantity)
      if (!inStock) {
        return NextResponse.json({ 
          error: `Sorry, ${item.product.name} is out of stock or has insufficient quantity.` 
        }, { status: 400 })
      }
    }

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: [item.product.image_url],
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      billing_address_collection: 'required',
      metadata: {
        order_type: 'online',
        cartItems: JSON.stringify(cartItems.map(item => ({ id: item.product.id, quantity: item.quantity })))
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
