import React, { useState, Suspense } from 'react';
import { AppState } from './types';
import IntroAnimation from './components/IntroAnimation';
import RegistrationModal from './components/RegistrationModal';

// Lazy load the Dashboard to optimize initial bundle size
const Dashboard = React.lazy(() => import('./components/Dashboard'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-ua-blue border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('intro');

  return (
    <>
      {appState === 'intro' && (
        <IntroAnimation onComplete={() => setAppState('registration')} />
      )}
      
      {appState === 'registration' && (
        <RegistrationModal onComplete={() => setAppState('dashboard')} />
      )}
      
      {appState === 'dashboard' && (
        <Suspense fallback={<LoadingFallback />}>
          <Dashboard />
        </Suspense>
      )}
    </>
  );
};

export default App;