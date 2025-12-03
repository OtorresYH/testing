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
    const { invoiceId, recipientEmail, recipientName, invoiceNumber, amount, dueDate } = JSON.parse(event.body || '{}');

    if (!invoiceId || !recipientEmail || !invoiceNumber) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // ============================================
    // TODO: ADD YOUR EMAIL PROVIDER API KEY
    // ============================================
    // Choose an email provider (Resend recommended for Netlify):
    // - Resend: https://resend.com/api-keys
    // - SendGrid: https://sendgrid.com/
    // - Postmark: https://postmarkapp.com/
    //
    // Add your API key to Netlify environment variables as:
    // - RESEND_API_KEY (for Resend)
    // - SENDGRID_API_KEY (for SendGrid)
    // - POSTMARK_API_KEY (for Postmark)
    // ============================================

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    const SITE_URL = process.env.URL || 'http://localhost:8888';

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Supabase not configured' }),
      };
    }

    // Get invoice access token from database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('access_token')
      .eq('id', invoiceId)
      .maybeSingle();

    if (invoiceError || !invoice) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invoice not found' }),
      };
    }

    const invoiceUrl = `${SITE_URL}/invoice/${invoice.access_token}`;

    if (!RESEND_API_KEY) {
      console.log('Email would be sent to:', recipientEmail);
      console.log('Invoice URL:', invoiceUrl);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Email provider not configured. Add RESEND_API_KEY to Netlify environment variables.',
          invoiceUrl,
        }),
      };
    }

    // ============================================
    // EXAMPLE: Send email using Resend
    // ============================================
    // Uncomment when you have Resend API key and install resend package
    //
    // import { Resend } from 'resend';
    // const resend = new Resend(RESEND_API_KEY);
    //
    // await resend.emails.send({
    //   from: 'invoices@yourdomain.com', // Must be verified domain
    //   to: recipientEmail,
    //   subject: `Invoice ${invoiceNumber} from Your Company`,
    //   html: `
    //     <h2>New Invoice</h2>
    //     <p>Hello ${recipientName || 'there'},</p>
    //     <p>You have received a new invoice (${invoiceNumber}) for $${amount}.</p>
    //     <p>Due date: ${dueDate}</p>
    //     <p><a href="${invoiceUrl}" style="background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;margin-top:16px;">View Invoice</a></p>
    //     <p>Or copy this link: ${invoiceUrl}</p>
    //     <br/>
    //     <p>Thank you for your business!</p>
    //   `,
    // });
    // ============================================

    // ============================================
    // ALTERNATIVE: Send email using SendGrid
    // ============================================
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //
    // await sgMail.send({
    //   to: recipientEmail,
    //   from: 'invoices@yourdomain.com',
    //   subject: `Invoice ${invoiceNumber} from Your Company`,
    //   html: `...same html as above...`,
    // });
    // ============================================

    // Update invoice status to 'sent'
    await supabase
      .from('invoices')
      .update({
        status: 'sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Email integration ready - Uncomment code and add email package',
        invoiceUrl,
      }),
    };
  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
