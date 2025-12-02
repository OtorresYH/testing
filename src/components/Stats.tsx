import React from 'react';
import { Section } from './Section';
import { TrendingUp, FileText, Building } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-accent-500 shadow-md">
          {icon}
        </div>
      </div>
      <p className="text-4xl md:text-5xl font-bold text-white mb-2">{value}</p>
      <p className="text-navy-200 text-lg">{label}</p>
    </div>
  );
};

export const Stats: React.FC = () => {
  const stats = [
    {
      icon: <FileText className="w-7 h-7" />,
      value: '5,000+',
      label: 'Invoices sent',
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      value: '38%',
      label: 'Average payment time reduced',
    },
    {
      icon: <Building className="w-7 h-7" />,
      value: '20+',
      label: 'Industries served',
    },
  ];

  return (
    <Section background="navy">
      <div className="grid md:grid-cols-3 gap-12">
        {stats.map((stat, index) => (
          <StatItem key={index} {...stat} />
        ))}
      </div>
    </Section>
  );
};
