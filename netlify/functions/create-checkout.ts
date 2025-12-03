import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { invoiceId, amount, invoiceNumber } = JSON.parse(event.body || '{}');

    if (!invoiceId || !amount || !invoiceNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const amountInCents = Math.round(parseFloat(amount) * 100);

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: `https://checkout.stripe.com/pay/test_session_example`,
        message: 'Stripe integration stub - Add your Stripe secret key to complete this integration',
      }),
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
