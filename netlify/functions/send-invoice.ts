import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { invoiceId, recipientEmail, invoiceUrl } = JSON.parse(event.body || '{}');

    if (!invoiceId || !recipientEmail || !invoiceUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    console.log('Email would be sent to:', recipientEmail);
    console.log('Invoice URL:', invoiceUrl);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Email integration stub - Add your email provider API key to complete this integration',
      }),
    };
  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
