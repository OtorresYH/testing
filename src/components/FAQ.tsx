import React, { useState } from 'react';
import { Section } from './Section';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-accent-600 transition-colors"
      >
        <span className="text-lg font-semibold text-navy-900 pr-8">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-navy-600 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-navy-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const faqs = [
    {
      question: 'Do I need accounting experience to use Whitmore PAYMENTS?',
      answer:
        'Not at all. Whitmore PAYMENTS is designed for anyone who needs to send invoices and get paid. If you can send an email, you can use our app. No accounting jargon, no complicated setup.',
    },
    {
      question: 'How long does setup take?',
      answer:
        'Most users are up and running in under 5 minutes. Just add your business details, connect your payment method, and you can start sending invoices immediately.',
    },
    {
      question: 'Which payment methods are supported?',
      answer:
        'We support all major credit and debit cards, as well as bank transfers. Your clients can pay with whatever method works best for them, and funds are deposited directly into your account.',
    },
    {
      question: 'Can I use this on mobile and desktop?',
      answer:
        'Yes! Whitmore PAYMENTS works seamlessly on phones, tablets, and desktop computers. Create and send invoices from wherever you are, and your data syncs automatically across all devices.',
    },
    {
      question: 'Can I export data for my accountant?',
      answer:
        'Absolutely. You can export your invoices, payments, and client data to CSV or PDF at any time. This makes tax season and bookkeeping much easier for you and your accountant.',
    },
    {
      question: 'What happens after the free trial?',
      answer:
        "Your free trial lasts 14 days with full access to all features. After that, you'll be prompted to choose a plan. You can cancel anytime, and there's no long-term contract required.",
    },
  ];

  return (
    <Section id="faq" className="scroll-mt-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Frequently asked questions</h2>
        <p className="text-lg text-navy-600 max-w-2xl mx-auto">
          Have a question? We've got answers. If you don't see what you're looking for, reach out to our support team.
        </p>
      </div>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft p-8">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </Section>
  );
};
