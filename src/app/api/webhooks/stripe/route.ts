import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { ProductService } from '@/lib/supabase-admin'

// Initialize Stripe with runtime check
let stripe: Stripe | null = null

// Initialize Stripe only when the API is called (at runtime)
function getStripeInstance(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    })
  }
  return stripe
}

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    // Get Stripe instance at runtime
    const stripeInstance = getStripeInstance()
    
    // Verify the event came from Stripe
    if (endpointSecret) {
      event = stripeInstance.webhooks.constructEvent(payload, sig, endpointSecret)
    } else {
      // For testing without a webhook secret
      event = JSON.parse(payload) as Stripe.Event
      console.log('⚠️ Webhook signature verification bypassed')
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    console.error(`Webhook Error: ${errorMessage}`)
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    try {
      // Get cart items from metadata
      if (session.metadata?.cartItems) {
        const cartItems = JSON.parse(session.metadata.cartItems)
        
        // Decrement stock for each item
        for (const item of cartItems) {
          await ProductService.decrementStock(item.id, item.quantity)
          console.log(`✅ Decremented stock for product ${item.id} by ${item.quantity}`)
        }
      }
      
      console.log(`✅ Payment successful for session: ${session.id}`)
      return NextResponse.json({ received: true })
    } catch (error) {
      console.error('Error processing webhook:', error)
      return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 })
    }
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true })
}
