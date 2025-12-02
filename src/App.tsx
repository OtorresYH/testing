import { useState } from 'react';
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

function App() {
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [contactSalesModalOpen, setContactSalesModalOpen] = useState(false);
  const [invoiceGeneratorOpen, setInvoiceGeneratorOpen] = useState(false);
  const [signupSource, setSignupSource] = useState('unknown');
  const [userEmail, setUserEmail] = useState('demo@example.com'); // In real app, this would come from auth

  const handleStartTrial = (source: string = 'unknown') => {
    setSignupSource(source);
    setSignupModalOpen(true);
  };

  const handleWatchDemo = () => {
    setDemoModalOpen(true);
  };

  const handleContactSales = () => {
    setContactSalesModalOpen(true);
  };

  const handleOpenInvoiceGenerator = () => {
    setInvoiceGeneratorOpen(true);
  };

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
        userEmail={userEmail}
      />
    </div>
  );
}

export default App;
