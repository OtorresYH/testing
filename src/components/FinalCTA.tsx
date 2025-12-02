import React from 'react';
import { Section } from './Section';
import { Button } from './Button';
import { Shield } from 'lucide-react';

interface FinalCTAProps {
  onStartTrial: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartTrial }) => {
  return (
    <Section background="gray">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-navy-900 mb-6">
          Ready to get paid faster?
        </h2>
        <p className="text-xl text-navy-600 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who've simplified their invoicing with Whitmore PAYMENTS.
        </p>
        <Button size="lg" className="mb-4" onClick={onStartTrial}>
          Start free trial
        </Button>
        <div className="flex items-center justify-center gap-2 text-navy-600">
          <Shield className="w-4 h-4" />
          <p className="text-sm">No credit card required. Set up in under 5 minutes.</p>
        </div>
      </div>
    </Section>
  );
};
