import React, { useState } from 'react';
import { Sparkles, Loader2, Check, X } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

interface AIEmailGeneratorProps {
  invoiceId?: string;
  emailType: 'invoice_created' | 'payment_reminder' | 'overdue_notice' | 'welcome_onboarding' | 'plan_upgrade';
  onEmailGenerated: (subject: string, body: string) => void;
  userId: string;
}

const AIEmailGenerator: React.FC<AIEmailGeneratorProps> = ({
  invoiceId,
  emailType,
  onEmailGenerated,
  userId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [extraNotes, setExtraNotes] = useState('');
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/.netlify/functions/ai-generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: emailType,
          invoiceId,
          extraNotes: extraNotes.trim() || undefined,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate email');
      }

      const data = await response.json();
      setGeneratedSubject(data.subject);
      setGeneratedBody(data.bodyText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseEmail = () => {
    onEmailGenerated(generatedSubject, generatedBody);
    setIsOpen(false);
    setGeneratedSubject('');
    setGeneratedBody('');
    setExtraNotes('');
  };

  const handleCancel = () => {
    setIsOpen(false);
    setGeneratedSubject('');
    setGeneratedBody('');
    setExtraNotes('');
    setError('');
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Generate with AI
      </Button>

      <Modal isOpen={isOpen} onClose={handleCancel} title="Generate Email with AI">
        <div className="space-y-4">
          {!generatedSubject ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  placeholder="Add any specific details you want to include in the email..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Optional: Add custom notes, special instructions, or specific details to personalize the email.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Email
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={generatedSubject}
                    onChange={(e) => setGeneratedSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Body
                  </label>
                  <textarea
                    value={generatedBody}
                    onChange={(e) => setGeneratedBody(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Review and edit the generated email before using it.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUseEmail}
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  Use This Email
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AIEmailGenerator;
