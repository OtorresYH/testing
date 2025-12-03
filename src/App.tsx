import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Audience } from './components/Audience';
import { Testimonials } from './components/Testimonials';
import { Stats } from './components/Stats';
import { Pricing } from './components/Pricing';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { SignupModal } from './components/SignupModal';
import { DemoModal } from './components/DemoModal';
import { ContactSalesModal } from './components/ContactSalesModal';
import { InvoiceGeneratorModal } from './components/InvoiceGeneratorModal';
import AuthModal from './components/Auth/AuthModal';
import Dashboard from './pages/Dashboard';
import InvoiceDetail from './pages/InvoiceDetail';
import PublicInvoice from './pages/PublicInvoice';
import AISupportChat from './components/AISupportChat';

function AppContent() {
  const { user, loading } = useAuth();
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [contactSalesModalOpen, setContactSalesModalOpen] = useState(false);
  const [invoiceGeneratorOpen, setInvoiceGeneratorOpen] = useState(false);
  const [signupSource, setSignupSource] = useState('unknown');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'dashboard' | 'invoice' | 'public-invoice'>('landing');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');

  const handleStartTrial = (source: string = 'unknown') => {
    if (user) {
      setView('dashboard');
    } else {
      setSignupSource(source);
      setAuthModalOpen(true);
    }
  };

  const handleWatchDemo = () => {
    setDemoModalOpen(true);
  };

  const handleContactSales = () => {
    setContactSalesModalOpen(true);
  };

  const handleOpenInvoiceGenerator = () => {
    if (user) {
      setView('dashboard');
    } else {
      setInvoiceGeneratorOpen(true);
    }
  };

  const handleCreateInvoice = () => {
    setInvoiceGeneratorOpen(true);
  };

  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setView('invoice');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const pathname = window.location.pathname;
  const publicInvoiceMatch = pathname.match(/^\/invoice\/([a-f0-9]+)$/);

  if (publicInvoiceMatch) {
    return <PublicInvoice token={publicInvoiceMatch[1]} />;
  }

  if (user && view === 'dashboard') {
    return (
      <>
        <Dashboard
          onCreateInvoice={handleCreateInvoice}
          onViewInvoice={handleViewInvoice}
        />
        <InvoiceGeneratorModal
          isOpen={invoiceGeneratorOpen}
          onClose={() => setInvoiceGeneratorOpen(false)}
          userEmail={user.email || ''}
        />
      </>
    );
  }

  if (user && view === 'invoice' && selectedInvoiceId) {
    return (
      <InvoiceDetail
        invoiceId={selectedInvoiceId}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onStartTrial={() => handleStartTrial('header')} />
      <main>
        <Hero
          onStartTrial={() => handleStartTrial('hero')}
          onWatchDemo={handleWatchDemo}
        />
        <Features onTryAI={handleOpenInvoiceGenerator} />
        <Audience />
        <Testimonials />
        <Stats />
        <HowItWorks />
        <Pricing
          onStartTrial={() => handleStartTrial('pricing')}
          onContactSales={handleContactSales}
        />
        <FAQ />
        <FinalCTA onStartTrial={() => handleStartTrial('final-cta')} />
      </main>
      <Footer />

      <AISupportChat userId={user?.id} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signup"
      />
      <SignupModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        source={signupSource}
      />
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
      <ContactSalesModal
        isOpen={contactSalesModalOpen}
        onClose={() => setContactSalesModalOpen(false)}
      />
      <InvoiceGeneratorModal
        isOpen={invoiceGeneratorOpen}
        onClose={() => setInvoiceGeneratorOpen(false)}
        userEmail={user?.email || 'demo@example.com'}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
