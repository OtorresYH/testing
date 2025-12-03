import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { invoiceId, amount, invoiceNumber, clientEmail } = JSON.parse(event.body || '{}');

    if (!invoiceId || !amount || !invoiceNumber) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const amountInCents = Math.round(parseFloat(amount) * 100);

    // ============================================
    // TODO: ADD YOUR STRIPE SECRET KEY
    // ============================================
    // Get your Stripe secret key from: https://dashboard.stripe.com/apikeys
    // Add it to Netlify environment variables as: STRIPE_SECRET_KEY
    //
    // Uncomment the code below once you have your Stripe key:
    // ============================================

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    if (!STRIPE_SECRET_KEY) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: null,
          message: 'Stripe not configured. Add STRIPE_SECRET_KEY to Netlify environment variables.',
          error: 'STRIPE_NOT_CONFIGURED',
        }),
      };
    }

    // Initialize Stripe (uncomment when ready)
    // const stripe = require('stripe')(STRIPE_SECRET_KEY);

    // Create Stripe Checkout Session (uncomment when ready)
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'usd',
    //         product_data: {
    //           name: `Invoice ${invoiceNumber}`,
    //           description: 'Invoice payment',
    //         },
    //         unit_amount: amountInCents,
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: `${process.env.URL}/invoice/${invoiceId}?success=true`,
    //   cancel_url: `${process.env.URL}/invoice/${invoiceId}?canceled=true`,
    //   customer_email: clientEmail,
    //   metadata: {
    //     invoiceId,
    //     invoiceNumber,
    //   },
    // });

    // return {
    //   statusCode: 200,
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ url: session.url }),
    // };

    // TEMPORARY: Return stub response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: `https://checkout.stripe.com/pay/test_session_example`,
        message: 'Stripe integration ready - Uncomment code and add Stripe package',
      }),
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
