import React from 'react';
import { Play, Clock } from 'lucide-react';
import { Button } from './Button';
import { Section } from './Section';

interface HeroProps {
  onStartTrial: () => void;
  onWatchDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartTrial, onWatchDemo }) => {
  return (
    <Section className="pt-20 md:pt-28">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
            Send invoices in seconds. Get paid faster.
          </h1>
          <p className="text-lg md:text-xl text-navy-600 leading-relaxed">
            Whitmore PAYMENTS is the simple invoice and payment app built for freelancers, repair pros, and local businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={onStartTrial}>Start free trial</Button>
            <button
              onClick={onWatchDemo}
              className="text-navy-800 font-semibold text-lg hover:text-accent-500 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Watch demo
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-navy-50 to-gray-100 rounded-2xl p-6 md:p-8 shadow-soft-lg">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-navy-800 text-white px-6 py-4">
              <h3 className="text-lg font-semibold">Recent Invoices</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <p className="font-semibold text-navy-800">Design Services</p>
                  <p className="text-sm text-navy-500">Blue Sky Marketing</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-navy-900">$1,250</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
                    Paid
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <p className="font-semibold text-navy-800">Monthly Retainer</p>
                  <p className="text-sm text-navy-500">Tech Startup Inc</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-navy-900">$3,500</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
                    Paid
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="font-semibold text-navy-800">Website Updates</p>
                  <p className="text-sm text-navy-500">Local Coffee Shop</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-navy-900">$850</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-navy-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-navy-700">Money collected this month</p>
                <p className="text-xl font-bold text-accent-600">$12,450</p>
              </div>
              <div className="mt-3 flex items-end gap-1 h-16">
                <div className="bg-accent-200 flex-1 rounded-t" style={{ height: '40%' }}></div>
                <div className="bg-accent-300 flex-1 rounded-t" style={{ height: '60%' }}></div>
                <div className="bg-accent-400 flex-1 rounded-t" style={{ height: '80%' }}></div>
                <div className="bg-accent-500 flex-1 rounded-t" style={{ height: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
