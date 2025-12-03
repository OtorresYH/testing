import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const sig = event.headers['stripe-signature'];

    if (!sig) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing stripe-signature header' }),
      };
    }

    // ============================================
    // TODO: ADD YOUR STRIPE WEBHOOK SECRET
    // ============================================
    // Get your webhook secret from: https://dashboard.stripe.com/webhooks
    // Add it to Netlify environment variables as: STRIPE_WEBHOOK_SECRET
    //
    // Also configure the webhook in Stripe Dashboard:
    // - URL: https://your-site.netlify.app/.netlify/functions/stripe-webhook
    // - Events to listen: checkout.session.completed, payment_intent.succeeded
    // ============================================

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      console.log('Stripe not fully configured');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ received: true, message: 'Stripe not configured' }),
      };
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('Supabase not configured');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Supabase not configured' }),
      };
    }

    // Initialize Stripe (uncomment when ready)
    // const stripe = require('stripe')(STRIPE_SECRET_KEY);

    // Verify webhook signature (uncomment when ready)
    // let stripeEvent;
    // try {
    //   stripeEvent = stripe.webhooks.constructEvent(
    //     event.body,
    //     sig,
    //     STRIPE_WEBHOOK_SECRET
    //   );
    // } catch (err) {
    //   console.error('Webhook signature verification failed:', err.message);
    //   return {
    //     statusCode: 400,
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ error: 'Invalid signature' }),
    //   };
    // }

    // Initialize Supabase with service role key (has admin access)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Handle the event (uncomment when ready)
    // switch (stripeEvent.type) {
    //   case 'checkout.session.completed': {
    //     const session = stripeEvent.data.object;
    //     const invoiceId = session.metadata.invoiceId;
    //     const amountPaid = session.amount_total / 100;
    //
    //     // Create payment record
    //     const { error: paymentError } = await supabase
    //       .from('payments')
    //       .insert([
    //         {
    //           invoice_id: invoiceId,
    //           amount: amountPaid,
    //           payment_method: 'card',
    //           stripe_payment_id: session.payment_intent,
    //           status: 'completed',
    //           paid_at: new Date().toISOString(),
    //         },
    //       ]);
    //
    //     if (paymentError) {
    //       console.error('Error creating payment record:', paymentError);
    //       break;
    //     }
    //
    //     // Update invoice status to paid
    //     const { error: invoiceError } = await supabase
    //       .from('invoices')
    //       .update({ status: 'paid', updated_at: new Date().toISOString() })
    //       .eq('id', invoiceId);
    //
    //     if (invoiceError) {
    //       console.error('Error updating invoice:', invoiceError);
    //     }
    //
    //     console.log(`Invoice ${invoiceId} marked as paid`);
    //     break;
    //   }
    //
    //   case 'payment_intent.succeeded': {
    //     const paymentIntent = stripeEvent.data.object;
    //     console.log('PaymentIntent succeeded:', paymentIntent.id);
    //     break;
    //   }
    //
    //   default:
    //     console.log(`Unhandled event type: ${stripeEvent.type}`);
    // }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Webhook processing failed' }),
    };
  }
};
