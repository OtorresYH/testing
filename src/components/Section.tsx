import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'navy';
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = '', background = 'white', id }) => {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    navy: 'bg-navy-900 text-white',
  };

  return (
    <section id={id} className={`py-16 md:py-24 ${bgClasses[background]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
};
