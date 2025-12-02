import React from 'react';
import { Briefcase, Wrench, Store } from 'lucide-react';
import { Card } from './Card';
import { Section } from './Section';

interface AudienceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AudienceCard: React.FC<AudienceCardProps> = ({ icon, title, description }) => {
  return (
    <Card hover className="text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center text-navy-700">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-navy-900">{title}</h3>
        <p className="text-navy-600 leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};

export const Audience: React.FC = () => {
  const audiences = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Freelancers',
      description:
        'Get paid faster and look more professional. Send polished invoices from anywhere, attach payment links, and spend less time chasing down clients.',
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'Home service pros',
      description:
        'Invoice on-site in seconds. Perfect for plumbers, cleaners, handymen, and detailers who need to get paid fast without the paperwork hassle.',
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: 'Local shops & studios',
      description:
        'Manage recurring clients with ease. Ideal for salons, tutors, and gyms who handle memberships, subscriptions, and repeat bookings.',
    },
  ];

  return (
    <Section>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
          Built for real businesses like yours
        </h2>
        <p className="text-lg text-navy-600 max-w-2xl mx-auto">
          Whether you're on your own or growing a team, Whitmore PAYMENTS adapts to your workflow.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {audiences.map((audience, index) => (
          <AudienceCard key={index} {...audience} />
        ))}
      </div>
    </Section>
  );
};
