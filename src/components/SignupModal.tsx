import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { createLead, Lead } from '../lib/supabase';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  planInterest?: string;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  source = 'unknown',
  planInterest = 'starter',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessType: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSubmitStatus('idle');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const leadData: Lead = {
        email: formData.email,
        name: formData.name || undefined,
        business_type: formData.businessType || undefined,
        phone: formData.phone || undefined,
        source,
        plan_interest: planInterest,
      };

      await createLead(leadData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', businessType: '', phone: '' });

      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
        setFormData({ name: '', email: '', businessType: '', phone: '' });
      }, 300);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Start your free trial">
      {submitStatus === 'success' ? (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-accent-500 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-navy-900 mb-2">You're all set!</h4>
          <p className="text-navy-600">
            Check your email for next steps to access your trial account.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-navy-600 mb-6">
            Start your 14-day free trial. No credit card required.
          </p>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-navy-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-navy-900 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="businessType" className="block text-sm font-semibold text-navy-900 mb-2">
              Business Type
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all bg-white"
            >
              <option value="">Select your business type</option>
              <option value="freelancer">Freelancer</option>
              <option value="service-pro">Home Service Professional</option>
              <option value="local-shop">Local Shop/Studio</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-navy-900 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all"
              placeholder="(555) 123-4567"
            />
          </div>

          {submitStatus === 'error' && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Starting your trial...' : 'Start free trial'}
          </Button>

          <p className="text-xs text-navy-500 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      )}
    </Modal>
  );
};
