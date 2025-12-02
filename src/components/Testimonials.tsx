import React from 'react';
import { Card } from './Card';
import { Section } from './Section';
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  name: string;
  business: string;
  avatar: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, name, business, avatar }) => {
  return (
    <Card className="h-full">
      <div className="flex flex-col space-y-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-navy-700 leading-relaxed italic">"{quote}"</p>
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
            {avatar}
          </div>
          <div>
            <p className="font-semibold text-navy-900">{name}</p>
            <p className="text-sm text-navy-600">{business}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote:
        'Before Whitmore PAYMENTS I spent Sunday nights chasing invoices. Now I send them on the spot and get paid in days, not weeks.',
      name: 'Sarah Chen',
      business: 'Freelance Designer',
      avatar: 'SC',
    },
    {
      quote:
        'Game changer for my detailing business. I invoice right after finishing a job, and customers love the one-tap payment option.',
      name: 'Marcus Williams',
      business: 'Mobile Auto Detailing',
      avatar: 'MW',
    },
    {
      quote:
        'Managing 50+ yoga studio memberships used to be a nightmare. Now recurring invoices go out automatically, and I can focus on teaching.',
      name: 'Jennifer Martinez',
      business: 'Yoga Studio Owner',
      avatar: 'JM',
    },
  ];

  return (
    <Section background="gray">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
          Trusted by thousands of professionals
        </h2>
        <p className="text-lg text-navy-600 max-w-2xl mx-auto">
          See why people are switching to Whitmore PAYMENTS to simplify their invoicing and get paid faster.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </Section>
  );
};
