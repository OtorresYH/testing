import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import { getInvoiceByToken, InvoiceWithItems } from '../lib/invoiceApi';
import Button from '../components/Button';

interface PublicInvoiceProps {
  token: string;
}

export default function PublicInvoice({ token }: PublicInvoiceProps) {
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [token]);

  const loadInvoice = async () => {
    setLoading(true);
    const { data, error } = await getInvoiceByToken(token);

    if (error) {
      setError(error.message);
    } else {
      setInvoice(data);
    }

    setLoading(false);
  };

  const handlePayNow = async () => {
    if (!invoice) return;

    setPaymentLoading(true);

    try {
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          amount: invoice.total,
          invoiceNumber: invoice.invoice_number,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create payment session. Please try again.');
        setPaymentLoading(false);
      }
    } catch (err) {
      alert('Failed to create payment session. Please try again.');
      setPaymentLoading(false);
    }
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
          <p className="text-gray-600">Please check the link and try again.</p>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === 'paid';
  const isOverdue = invoice.status === 'overdue';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Invoice Details</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPaid && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">This invoice has been paid</p>
          </div>
        )}

        {isOverdue && !isPaid && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 font-medium">This invoice is overdue</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
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

          <div className="flex justify-end mb-8">
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

          {!isPaid && (
            <div className="border-t border-gray-200 pt-6">
              <Button
                variant="primary"
                onClick={handlePayNow}
                disabled={paymentLoading}
                className="w-full sm:w-auto"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {paymentLoading ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          )}

          {invoice.notes && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">NOTES</h3>
              <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
