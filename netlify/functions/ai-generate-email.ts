import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

interface EmailRequest {
  type: 'invoice_created' | 'payment_reminder' | 'overdue_notice' | 'welcome_onboarding' | 'plan_upgrade';
  invoiceId?: string;
  extraNotes?: string;
  userId: string;
}

interface EmailResponse {
  subject: string;
  bodyText: string;
  bodyHtml: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: EmailRequest = JSON.parse(event.body || '{}');
    const { type, invoiceId, extraNotes, userId } = body;

    if (!type || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: type, userId' }),
      };
    }

    let invoiceData = null;
    let clientData = null;
    let userData = null;

    if (invoiceId) {
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_items(*),
          clients(*)
        `)
        .eq('id', invoiceId)
        .single();

      if (invoiceError) {
        throw new Error(`Failed to fetch invoice: ${invoiceError.message}`);
      }

      invoiceData = invoice;
      clientData = invoice.clients;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      userData = profile;
    }

    const prompt = buildEmailPrompt(type, invoiceData, clientData, userData, extraNotes);

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional email writing assistant for Whitmore Payments, an invoicing and payment management platform. Generate clear, professional, and friendly emails.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openaiData = await openaiResponse.json();
    const aiContent = openaiData.choices[0]?.message?.content || '';

    const emailContent = parseEmailContent(aiContent);

    try {
      await supabase.from('ai_email_logs').insert({
        user_id: userId,
        invoice_id: invoiceId || null,
        type,
        subject: emailContent.subject,
        body_text: emailContent.bodyText,
        body_html: emailContent.bodyHtml,
        extra_notes: extraNotes || null,
      });
    } catch (logError) {
      console.error('Failed to log AI email generation:', logError);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(emailContent),
    };
  } catch (error) {
    console.error('Error generating email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to generate email',
      }),
    };
  }
};

function buildEmailPrompt(
  type: string,
  invoice: any,
  client: any,
  user: any,
  extraNotes?: string
): string {
  let prompt = `Generate a professional email for the following scenario:\n\n`;
  prompt += `Context: Whitmore Payments is an invoicing and payment management platform.\n`;
  prompt += `Email Type: ${type}\n\n`;

  if (invoice && client) {
    prompt += `Invoice Details:\n`;
    prompt += `- Invoice Number: ${invoice.invoice_number}\n`;
    prompt += `- Amount: $${invoice.total_amount}\n`;
    prompt += `- Due Date: ${invoice.due_date}\n`;
    prompt += `- Status: ${invoice.status}\n`;
    prompt += `- Client Name: ${client.name}\n`;
    prompt += `- Client Email: ${client.email}\n\n`;
  }

  if (user) {
    prompt += `From: ${user.business_name || user.full_name || 'Whitmore Payments'}\n\n`;
  }

  if (extraNotes) {
    prompt += `Additional Notes: ${extraNotes}\n\n`;
  }

  const typeInstructions: Record<string, string> = {
    invoice_created: 'Write an email informing the client that a new invoice has been created and is ready for payment. Include the invoice details and a call-to-action to view and pay.',
    payment_reminder: 'Write a friendly reminder email about the upcoming invoice due date. Be professional but not pushy.',
    overdue_notice: 'Write a polite but firm email about an overdue invoice. Express understanding while emphasizing the need for payment.',
    welcome_onboarding: 'Write a welcoming onboarding email introducing the client to Whitmore Payments and explaining how to get started.',
    plan_upgrade: 'Write an email about upgrading to a better plan, highlighting the benefits and value.',
  };

  prompt += typeInstructions[type] || 'Write a professional business email.';
  prompt += `\n\nFormat your response exactly like this:\n`;
  prompt += `SUBJECT: [subject line here]\n\n`;
  prompt += `BODY:\n[email body here with paragraphs]\n\n`;
  prompt += `Make the email warm, professional, and actionable. Use proper formatting with paragraphs.`;

  return prompt;
}

function parseEmailContent(aiContent: string): EmailResponse {
  const subjectMatch = aiContent.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
  const bodyMatch = aiContent.match(/BODY:\s*([\s\S]+?)$/i);

  const subject = subjectMatch ? subjectMatch[1].trim() : 'Your Invoice from Whitmore Payments';
  const bodyText = bodyMatch ? bodyMatch[1].trim() : aiContent;

  const bodyHtml = bodyText
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.trim()}</p>`)
    .join('\n');

  return {
    subject,
    bodyText,
    bodyHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">${bodyHtml}</div>`,
  };
}
