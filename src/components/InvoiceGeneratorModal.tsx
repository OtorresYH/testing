import React, { useState } from 'react';
import { Modal } from './Modal';
import { AIInvoiceGenerator } from './AIInvoiceGenerator';
import { InvoiceDashboard } from './InvoiceDashboard';

interface InvoiceGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export const InvoiceGeneratorModal: React.FC<InvoiceGeneratorModalProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleInvoiceCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          <AIInvoiceGenerator
            userEmail={userEmail}
            onInvoiceCreated={handleInvoiceCreated}
          />
          <InvoiceDashboard userEmail={userEmail} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </Modal>
  );
};
