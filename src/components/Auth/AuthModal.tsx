import { useState } from 'react';
import Modal from '../Modal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  const handleSuccess = () => {
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Sign In';
      case 'signup':
        return 'Create Account';
      case 'forgot':
        return 'Reset Password';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      {mode === 'login' && (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToSignup={() => setMode('signup')}
          onForgotPassword={() => setMode('forgot')}
        />
      )}
      {mode === 'signup' && (
        <SignupForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => setMode('login')}
        />
      )}
      {mode === 'forgot' && (
        <ForgotPasswordForm
          onSuccess={() => setMode('login')}
          onBackToLogin={() => setMode('login')}
        />
      )}
    </Modal>
  );
}
