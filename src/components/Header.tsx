import React from 'react';
import { Logo } from './Logo';
import { Button } from './Button';

interface HeaderProps {
  onStartTrial: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartTrial }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-navy-700 hover:text-accent-500 font-medium transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-navy-700 hover:text-accent-500 font-medium transition-colors"
            >
              Pricing
            </button>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('faq');
              }}
              className="text-navy-700 hover:text-accent-500 font-medium transition-colors"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" onClick={onStartTrial}>Start free trial</Button>
          </div>
        </div>
      </nav>
    </header>
  );
};
