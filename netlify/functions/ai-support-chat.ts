import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  sessionId?: string;
  userId?: string;
  planContext?: string;
}

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 10;

const SYSTEM_PROMPT = `You are Whitmore AI, a helpful customer support assistant for Whitmore Payments, a professional invoicing and payment management platform.

About Whitmore Payments:
- A modern SaaS platform for creating, sending, and managing invoices
- Features include invoice generation, payment tracking, client management, and automated reminders
- Secure payment processing with Stripe integration
- Professional invoice templates and customization options

Available Plans:
1. STARTER ($9/month)
   - Up to 10 invoices per month
   - Basic invoice templates
   - Email support
   - Payment tracking
   - Perfect for freelancers and small businesses

2. PROFESSIONAL ($29/month)
   - Unlimited invoices
   - Advanced templates and customization
   - Priority support
   - Automated payment reminders
   - Recurring invoices
   - Multi-currency support
   - Ideal for growing businesses

3. ENTERPRISE (Custom pricing)
   - Everything in Professional
   - Dedicated account manager
   - Custom integrations
   - Advanced reporting and analytics
   - API access
   - White-label options
   - For large organizations

Your Role:
- Answer questions about Whitmore Payments features, plans, and pricing
- Help potential customers choose the right plan
- Explain how invoicing works on the platform
- Address common questions about payments, security, and integrations
- Be friendly, professional, and concise
- If you don't know something, recommend contacting human support at support@whitmorepayments.com

Important Rules:
- Only provide information based on the plans and features listed above
- Do not make up features or pricing
- Do not provide technical support for implementation issues
- For complex questions or account-specific issues, direct users to human support
- Keep responses clear and concise (2-3 paragraphs maximum)
- Use a warm, professional tone`;

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
    const body: ChatRequest = JSON.parse(event.body || '{}');
    let { messages, sessionId, userId, planContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Messages array is required' }),
      };
    }

    messages = messages
      .slice(-MAX_HISTORY_MESSAGES)
      .map(msg => ({
        ...msg,
        content: msg.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    if (!sessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from('ai_support_sessions')
        .insert({
          user_id: userId || null,
          message_count: 0,
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Failed to create session:', sessionError);
      } else {
        sessionId = newSession.id;
      }
    }

    let systemPrompt = SYSTEM_PROMPT;
    if (planContext) {
      systemPrompt += `\n\nUser's Current Plan: ${planContext}`;
    }

    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openaiData = await openaiResponse.json();
    const assistantMessage = openaiData.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';

    if (sessionId) {
      try {
        const userMessage = messages[messages.length - 1];
        await supabase.from('ai_support_messages').insert([
          {
            session_id: sessionId,
            role: userMessage.role,
            content: userMessage.content,
          },
          {
            session_id: sessionId,
            role: 'assistant',
            content: assistantMessage,
          },
        ]);

        await supabase
          .from('ai_support_sessions')
          .update({
            message_count: messages.length + 1,
          })
          .eq('id', sessionId);
      } catch (logError) {
        console.error('Failed to log chat messages:', logError);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: assistantMessage,
        sessionId,
      }),
    };
  } catch (error) {
    console.error('Error in AI support chat:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to process chat message',
      }),
    };
  }
};
