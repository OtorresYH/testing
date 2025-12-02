import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { generateInvoiceFromPrompt } from '../lib/openai';
import { createInvoice, Invoice } from '../lib/invoices';

interface AIInvoiceGeneratorProps {
  userEmail: string;
  onInvoiceCreated?: (invoice: Invoice) => void;
}

export const AIInvoiceGenerator: React.FC<AIInvoiceGeneratorProps> = ({
  userEmail,
  onInvoiceCreated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const examplePrompts = [
    'Create an invoice for John Smith at ABC Corp for web design services, 40 hours at $100/hour',
    'Invoice Sarah Johnson for logo design $500, business card design $200, and letterhead $150',
    'Bill Tech Startup Inc for monthly retainer $2500 due in 15 days',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError('');
    setSuccess(false);
    setGeneratedInvoice(null);

    try {
      const invoiceData = await generateInvoiceFromPrompt(prompt);

      const invoice: Invoice = {
        ...invoiceData,
        userEmail,
        status: 'draft',
        aiPrompt: prompt,
      };

      const savedInvoice = await createInvoice(invoice);
      setGeneratedInvoice(savedInvoice);
      setSuccess(true);

      if (onInvoiceCreated) {
        onInvoiceCreated(savedInvoice);
      }

      setTimeout(() => {
        setPrompt('');
        setGeneratedInvoice(null);
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  const fillExample = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-2">
                AI Invoice Generator
              </h2>
              <p className="text-navy-600">
                Describe your invoice in plain English and let AI generate it for you instantly.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-semibold text-navy-900 mb-2">
                Describe your invoice
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create an invoice for ABC Company for 20 hours of consulting at $150/hour..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all resize-none"
                disabled={isGenerating}
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && generatedInvoice && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    Invoice created successfully!
                  </p>
                  <p className="text-sm text-green-700">
                    {generatedInvoice.invoiceNumber} for {generatedInvoice.clientName} - $
                    {generatedInvoice.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating invoice...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Invoice with AI
                </>
              )}
            </Button>
          </form>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-navy-900 mb-3">Try these examples:</p>
            <div className="space-y-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => fillExample(example)}
                  className="w-full text-left text-sm text-navy-600 hover:text-accent-600 bg-gray-50 hover:bg-accent-50 p-3 rounded-lg transition-colors"
                  disabled={isGenerating}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {generatedInvoice && !success && (
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-navy-900">Generated Invoice Preview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-navy-600">Invoice Number:</span>
                <span className="font-semibold text-navy-900">{generatedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-600">Client:</span>
                <span className="font-semibold text-navy-900">{generatedInvoice.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-600">Description:</span>
                <span className="font-semibold text-navy-900 text-right max-w-xs">
                  {generatedInvoice.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-600">Amount:</span>
                <span className="font-bold text-accent-600 text-lg">
                  ${generatedInvoice.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
