import React from 'react';
import { Zap, Link as LinkIcon, RefreshCw, Users } from 'lucide-react';
import { Card } from './Card';
import { Section } from './Section';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card hover>
      <div className="flex flex-col items-start space-y-4">
        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-navy-900">{title}</h3>
        <p className="text-navy-600 leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Quick invoice generator',
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
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Client history',
      description: 'See every invoice, payment, and note for each client in one simple view.',
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
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </Section>
  );
};
