import React from 'react';
import { Modal } from './Modal';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Demo">
      <div className="space-y-4">
        <div className="aspect-video bg-navy-100 rounded-xl flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-navy-600 mb-4">
              Watch how Whitmore PAYMENTS simplifies invoicing and payments.
            </p>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-navy-800 font-semibold mb-2">Demo Video Coming Soon</p>
              <p className="text-sm text-navy-600">
                In the meantime, start your free trial to explore all features hands-on.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm text-navy-700">
          <p className="font-semibold">What you'll see in the demo:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Create an invoice in under 60 seconds</li>
            <li>Generate secure payment links</li>
            <li>Set up recurring billing for clients</li>
            <li>Track payments and client history</li>
            <li>Access everything from mobile or desktop</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
