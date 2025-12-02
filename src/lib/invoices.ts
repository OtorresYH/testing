import { supabase } from './supabase';
import { InvoiceData } from './openai';

export interface Invoice extends InvoiceData {
  id?: string;
  invoiceNumber?: string;
  userEmail: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  aiPrompt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Generate unique invoice number
const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
};

// Create a new invoice
export const createInvoice = async (invoiceData: Invoice): Promise<Invoice> => {
  const invoiceNumber = generateInvoiceNumber();

  const { data, error } = await supabase
    .from('invoices')
    .insert([
      {
        invoice_number: invoiceNumber,
        user_email: invoiceData.userEmail,
        client_name: invoiceData.clientName,
        client_email: invoiceData.clientEmail || null,
        description: invoiceData.description,
        amount: invoiceData.amount,
        currency: invoiceData.currency || 'USD',
        due_date: invoiceData.dueDate || null,
        status: invoiceData.status || 'draft',
        ai_prompt: invoiceData.aiPrompt || null,
        line_items: invoiceData.lineItems || [],
        notes: invoiceData.notes || null,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create invoice: ${error.message}`);
  }

  return {
    id: data.id,
    invoiceNumber: data.invoice_number,
    userEmail: data.user_email,
    clientName: data.client_name,
    clientEmail: data.client_email,
    description: data.description,
    amount: data.amount,
    currency: data.currency,
    dueDate: data.due_date,
    status: data.status,
    aiPrompt: data.ai_prompt,
    lineItems: data.line_items,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

// Get all invoices for a user
export const getInvoices = async (userEmail: string): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch invoices: ${error.message}`);
  }

  return data.map((invoice) => ({
    id: invoice.id,
    invoiceNumber: invoice.invoice_number,
    userEmail: invoice.user_email,
    clientName: invoice.client_name,
    clientEmail: invoice.client_email,
    description: invoice.description,
    amount: invoice.amount,
    currency: invoice.currency,
    dueDate: invoice.due_date,
    status: invoice.status,
    aiPrompt: invoice.ai_prompt,
    lineItems: invoice.line_items,
    notes: invoice.notes,
    createdAt: invoice.created_at,
    updatedAt: invoice.updated_at,
  }));
};

// Update invoice status
export const updateInvoiceStatus = async (
  id: string,
  status: 'draft' | 'sent' | 'paid' | 'overdue'
): Promise<void> => {
  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update invoice: ${error.message}`);
  }
};

// Delete an invoice
export const deleteInvoice = async (id: string): Promise<void> => {
  const { error } = await supabase.from('invoices').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete invoice: ${error.message}`);
  }
};
