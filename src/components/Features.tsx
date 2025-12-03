import React from 'react';
import { Zap, Link as LinkIcon, RefreshCw, Sparkles } from 'lucide-react';
import { Card } from './Card';
import { Section } from './Section';
import { Button } from './Button';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isAI?: boolean;
  onTryAI?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, isAI, onTryAI }) => {
  return (
    <Card hover className={isAI ? 'border-2 border-accent-500 relative overflow-hidden' : ''}>
      {isAI && (
        <div className="absolute top-0 right-0 bg-gradient-to-br from-accent-500 to-accent-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
          NEW
        </div>
      )}
      <div className="flex flex-col items-start space-y-4">
        <div className={`w-12 h-12 ${isAI ? 'bg-gradient-to-br from-accent-500 to-accent-600' : 'bg-accent-100'} rounded-xl flex items-center justify-center ${isAI ? 'text-white' : 'text-accent-600'}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-navy-900">{title}</h3>
        <p className="text-navy-600 leading-relaxed">{description}</p>
        {isAI && onTryAI && (
          <Button variant="primary" size="sm" onClick={onTryAI} className="mt-2">
            <Sparkles className="w-4 h-4 mr-1" />
            Try AI Generator
          </Button>
        )}
      </div>
    </Card>
  );
};

interface FeaturesProps {
  onTryAI?: () => void;
}

export const Features: React.FC<FeaturesProps> = ({ onTryAI }) => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Invoice Generator',
      description: 'Describe your invoice in plain English and let AI generate it instantly. No forms, no hassle.',
      isAI: true,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Quick invoice creation',
      description: 'Create and send professional invoices in under a minute from desktop or phone.',
    },
    {
      icon: <LinkIcon className="w-6 h-6" />,
      title: 'One-tap payment links',
      description: 'Attach secure pay links so clients can pay by card or bank in one tap.',
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: 'Recurring invoices',
      description: 'Automate invoices for subscriptions, retainers, and repeat clients.',
    },
  ];

  return (
    <Section background="gray" className="scroll-mt-20" id="features">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
          Everything you need to get paid
        </h2>
        <p className="text-lg text-navy-600 max-w-2xl mx-auto">
          Simple tools that help you invoice faster and collect payments without the hassle.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} onTryAI={feature.isAI ? onTryAI : undefined} />
        ))}
      </div>
    </Section>
  );
};
