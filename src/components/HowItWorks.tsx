import React from 'react';
import { Section } from './Section';
import { FileText, Send, DollarSign } from 'lucide-react';

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  showConnector?: boolean;
}

const Step: React.FC<StepProps> = ({ number, icon, title, showConnector = true }) => {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="relative">
        <div className="w-20 h-20 bg-accent-500 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
          {number}
        </div>
      </div>
      {showConnector && (
        <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-accent-500 to-navy-200"></div>
      )}
      <h3 className="text-xl font-bold text-navy-900 mt-4">{title}</h3>
    </div>
  );
};

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <FileText className="w-10 h-10" />,
      title: 'Create your first invoice',
    },
    {
      icon: <Send className="w-10 h-10" />,
      title: 'Share a secure pay link',
    },
    {
      icon: <DollarSign className="w-10 h-10" />,
      title: 'Get paid and track everything',
    },
  ];

  return (
    <Section background="gray">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">How it works</h2>
        <p className="text-lg text-navy-600 max-w-2xl mx-auto">
          Get started in minutes. No accounting degree required.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <Step
            key={index}
            number={index + 1}
            icon={step.icon}
            title={step.title}
            showConnector={index < steps.length - 1}
          />
        ))}
      </div>
    </Section>
  );
};
