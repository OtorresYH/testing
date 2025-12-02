import React from 'react';
import { Card } from './Card';
import { Section } from './Section';
import { Button } from './Button';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  recommended?: boolean;
  onClick: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  description,
  price,
  features,
  buttonText,
  buttonVariant = 'outline',
  recommended = false,
  onClick,
}) => {
  return (
    <div className="relative">
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Recommended
        </div>
      )}
      <Card className={`h-full ${recommended ? 'border-2 border-accent-500' : ''}`}>
        <div className="flex flex-col space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-navy-900 mb-2">{name}</h3>
            <p className="text-navy-600">{description}</p>
          </div>
          <div>
            <span className="text-5xl font-bold text-navy-900">{price}</span>
            <span className="text-navy-600 ml-2">/month</span>
          </div>
          <ul className="space-y-4 flex-grow">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                <span className="text-navy-700">{feature}</span>
              </li>
            ))}
          </ul>
          <Button variant={buttonVariant} className="w-full" onClick={onClick}>
            {buttonText}
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface PricingProps {
  onStartTrial: () => void;
  onContactSales: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onStartTrial, onContactSales }) => {
  const plans = [
    {
      name: 'Starter',
      description: 'For solo users',
      price: '$19',
      features: [
        'Send unlimited invoices',
        'Accept card & bank payments',
        'Payment links & reminders',
        'Basic reporting',
        'Mobile & desktop access',
        'Email support',
      ],
      buttonText: 'Start free trial',
      buttonVariant: 'primary' as const,
      recommended: true,
    },
    {
      name: 'Team',
      description: 'For growing businesses',
      price: '$49',
      features: [
        'Everything in Starter',
        'Multiple team members',
        'Roles & permissions',
        'Advanced reporting & exports',
        'Custom invoice branding',
        'Priority support',
      ],
      buttonText: 'Talk to sales',
      buttonVariant: 'outline' as const,
      recommended: false,
    },
  ];

  return (
    <Section id="pricing" className="scroll-mt-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Simple, transparent pricing</h2>
        <p className="text-lg text-navy-600 max-w-2xl mx-auto">
          Choose the plan that fits your business. Start with a 14-day free trial, no credit card required.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <PricingCard
          {...plans[0]}
          onClick={onStartTrial}
        />
        <PricingCard
          {...plans[1]}
          onClick={onContactSales}
        />
      </div>
    </Section>
  );
};
