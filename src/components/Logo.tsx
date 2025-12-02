import React from 'react';
import { Wallet } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Wallet className="w-8 h-8 text-accent-500" />
      <div className="flex flex-col leading-tight">
        <span className="text-2xl font-bold text-navy-900">Whitmore</span>
        <span className="text-[10px] font-semibold tracking-wider text-navy-600 uppercase">Payments</span>
      </div>
    </div>
  );
};
