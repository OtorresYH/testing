import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Send, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from './Card';
import { getInvoices, deleteInvoice, updateInvoiceStatus, Invoice } from '../lib/invoices';

interface InvoiceDashboardProps {
  userEmail: string;
  refreshTrigger?: number;
}

export const InvoiceDashboard: React.FC<InvoiceDashboardProps> = ({
  userEmail,
  refreshTrigger,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getInvoices(userEmail);
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [userEmail, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await deleteInvoice(id);
      setInvoices(invoices.filter((inv) => inv.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete invoice');
    }
  };

  const handleStatusChange = async (id: string, status: Invoice['status']) => {
    try {
      await updateInvoiceStatus(id, status);
      setInvoices(
        invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'sent':
        return <Send className="w-4 h-4 text-blue-600" />;
      case 'overdue':
        return <Clock className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'sent':
        return 'bg-blue-100 text-blue-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  if (loading) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto"></div>
          <p className="mt-4 text-navy-600">Loading invoices...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-navy-600 mb-1">Total Invoiced</p>
              <p className="text-2xl font-bold text-navy-900">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-navy-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-navy-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-navy-600 mb-1">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ${paidAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-navy-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                ${pendingAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-navy-900">Recent Invoices</h3>

          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-navy-600 mb-2">No invoices yet</p>
              <p className="text-sm text-navy-500">
                Use the AI Invoice Generator above to create your first invoice
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-accent-500 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-navy-900">
                          {invoice.invoiceNumber}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-sm text-navy-700 mb-1">
                        {invoice.clientName}
                      </p>
                      <p className="text-sm text-navy-600 truncate">
                        {invoice.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-navy-900 mb-2">
                        ${invoice.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <select
                          value={invoice.status}
                          onChange={(e) =>
                            handleStatusChange(
                              invoice.id!,
                              e.target.value as Invoice['status']
                            )
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
                        <button
                          onClick={() => handleDelete(invoice.id!)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {invoice.lineItems && invoice.lineItems.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-navy-700 mb-2">
                        Line Items:
                      </p>
                      <div className="space-y-1">
                        {invoice.lineItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-navy-600 flex justify-between"
                          >
                            <span>
                              {item.description} ({item.quantity} × $
                              {item.rate.toFixed(2)})
                            </span>
                            <span className="font-semibold">
                              ${item.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
