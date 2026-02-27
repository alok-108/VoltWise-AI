/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="antialiased">
      {view === 'landing' ? (
        <LandingPage onGetStarted={() => setView('dashboard')} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
