import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey || apiKey === 'your_openai_api_key_here') {
  console.warn('OpenAI API key not configured. AI invoice generation will not work.');
}

export const openai = apiKey && apiKey !== 'your_openai_api_key_here'
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Note: In production, API calls should go through a backend
    })
  : null;

export interface InvoiceData {
  clientName: string;
  clientEmail?: string;
  description: string;
  amount: number;
  currency: string;
  dueDate?: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  notes?: string;
}

export const generateInvoiceFromPrompt = async (prompt: string): Promise<InvoiceData> => {
  if (!openai) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  const systemPrompt = `You are an invoice generation assistant. Given a natural language description of an invoice, extract and structure the invoice details in JSON format.

Rules:
1. Extract client/customer name
2. Parse the service/product description
3. Calculate amounts (if quantities and rates provided)
4. Extract or generate line items
5. Set a reasonable due date (default 30 days from today)
6. Use USD as default currency unless specified
7. Generate clear, professional descriptions

Return ONLY valid JSON in this exact format:
{
  "clientName": "string",
  "clientEmail": "string or empty",
  "description": "brief summary",
  "amount": number (total),
  "currency": "USD",
  "dueDate": "YYYY-MM-DD",
  "lineItems": [
    {
      "description": "string",
      "quantity": number,
      "rate": number,
      "amount": number
    }
  ],
  "notes": "any additional notes"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const invoiceData = JSON.parse(content) as InvoiceData;

    // Validate required fields
    if (!invoiceData.clientName || !invoiceData.description || !invoiceData.amount) {
      throw new Error('Invalid invoice data generated. Missing required fields.');
    }

    return invoiceData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate invoice: ${error.message}`);
    }
    throw new Error('Failed to generate invoice. Please try again.');
  }
};
