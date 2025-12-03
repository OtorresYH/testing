import { supabase } from './supabase';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id?: string;
  user_id?: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  access_token?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export interface Payment {
  id?: string;
  invoice_id: string;
  amount: number;
  payment_method?: string;
  stripe_payment_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paid_at?: string;
  created_at?: string;
}

export async function createInvoice(invoice: Invoice, items: InvoiceItem[]): Promise<{ data: Invoice | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const invoiceNumber = await generateInvoiceNumber();

    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        user_id: user.id,
        invoice_number: invoiceNumber,
        client_name: invoice.client_name,
        client_email: invoice.client_email,
        client_address: invoice.client_address,
        status: invoice.status || 'draft',
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        subtotal: invoice.subtotal,
        tax: invoice.tax || 0,
        total: invoice.total,
        notes: invoice.notes,
      }])
      .select()
      .single();

    if (invoiceError || !invoiceData) {
      return { data: null, error: invoiceError };
    }

    if (items.length > 0) {
      const itemsToInsert = items.map(item => ({
        invoice_id: invoiceData.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.amount,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);

      if (itemsError) {
        return { data: null, error: itemsError };
      }
    }

    return { data: invoiceData, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getUserInvoices(): Promise<{ data: Invoice[] | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getInvoiceById(invoiceId: string): Promise<{ data: InvoiceWithItems | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (invoiceError || !invoiceData) {
      return { data: null, error: invoiceError };
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: true });

    if (itemsError) {
      return { data: null, error: itemsError };
    }

    return {
      data: {
        ...invoiceData,
        items: itemsData || [],
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getInvoiceByToken(token: string): Promise<{ data: InvoiceWithItems | null; error: any }> {
  try {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('access_token', token)
      .maybeSingle();

    if (invoiceError || !invoiceData) {
      return { data: null, error: invoiceError || { message: 'Invoice not found' } };
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceData.id)
      .order('created_at', { ascending: true });

    if (itemsError) {
      return { data: null, error: itemsError };
    }

    await supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', invoiceData.id)
      .order('created_at', { ascending: false });

    return {
      data: {
        ...invoiceData,
        items: itemsData || [],
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateInvoice(invoiceId: string, updates: Partial<Invoice>): Promise<{ data: Invoice | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data, error } = await supabase
      .from('invoices')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteInvoice(invoiceId: string): Promise<{ error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: { message: 'Not authenticated' } };
    }

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId)
      .eq('user_id', user.id);

    return { error };
  } catch (error) {
    return { error };
  }
}

export async function getInvoicePayments(invoiceId: string): Promise<{ data: Payment[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

async function generateInvoiceNumber(): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('generate_invoice_number');

    if (error || !data) {
      const timestamp = Date.now().toString().slice(-5);
      return `INV-${timestamp}`;
    }

    return data;
  } catch (err) {
    const timestamp = Date.now().toString().slice(-5);
    return `INV-${timestamp}`;
  }
}
