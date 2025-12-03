import { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Download, Trash2, ExternalLink } from 'lucide-react';
import { getInvoiceById, updateInvoice, deleteInvoice, InvoiceWithItems } from '../lib/invoiceApi';
import Button from '../components/Button';

interface InvoiceDetailProps {
  invoiceId: string;
  onBack: () => void;
}

export default function InvoiceDetail({ invoiceId, onBack }: InvoiceDetailProps) {
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  const loadInvoice = async () => {
    setLoading(true);
    const { data, error } = await getInvoiceById(invoiceId);

    if (error) {
      setError(error.message);
    } else {
      setInvoice(data);
    }

    setLoading(false);
  };

  const handleSendInvoice = async () => {
    if (!invoice) return;

    setActionLoading(true);

    const publicUrl = `${window.location.origin}/invoice/${invoice.access_token}`;

    const response = await fetch('/.netlify/functions/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceId: invoice.id,
        recipientEmail: invoice.client_email,
        invoiceUrl: publicUrl,
      }),
    });

    if (response.ok) {
      await updateInvoice(invoice.id!, { status: 'sent' });
      await loadInvoice();
      alert('Invoice sent successfully!');
    } else {
      alert('Failed to send invoice. Please try again.');
    }

    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!invoice) return;

    if (confirm('Are you sure you want to delete this invoice?')) {
      setActionLoading(true);
      const { error } = await deleteInvoice(invoice.id!);

      if (error) {
        alert('Failed to delete invoice');
      } else {
        onBack();
      }

      setActionLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!invoice) return;

    const publicUrl = `${window.location.origin}/invoice/${invoice.access_token}`;
    navigator.clipboard.writeText(publicUrl);
    alert('Invoice link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Invoice not found'}</p>
          <Button variant="secondary" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={handleCopyLink}
                disabled={actionLoading}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                variant="primary"
                onClick={handleSendInvoice}
                disabled={actionLoading}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Invoice
              </Button>
              <Button
                variant="secondary"
                onClick={handleDelete}
                disabled={actionLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
              <p className="text-lg text-gray-600">{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Issue Date</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(invoice.issue_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">Due Date</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(invoice.due_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">BILL TO</h3>
              <p className="text-gray-900 font-medium">{invoice.client_name}</p>
              <p className="text-gray-600">{invoice.client_email}</p>
              {invoice.client_address && (
                <p className="text-gray-600 whitespace-pre-line">{invoice.client_address}</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-semibold text-gray-900">Description</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900">Unit Price</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-gray-100">
                    <td className="py-4 text-gray-900">{item.description}</td>
                    <td className="py-4 text-right text-gray-900">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-900">
                      ${Number(item.unit_price).toFixed(2)}
                    </td>
                    <td className="py-4 text-right text-gray-900 font-medium">
                      ${Number(item.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 text-gray-900">
                <span>Subtotal</span>
                <span>${Number(invoice.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-900">
                <span>Tax</span>
                <span>${Number(invoice.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-t border-gray-200 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${Number(invoice.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">NOTES</h3>
              <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium text-gray-900">{invoice.status.toUpperCase()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Created: {new Date(invoice.created_at!).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
