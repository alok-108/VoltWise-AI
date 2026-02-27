/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import { authService } from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await authService.getMe();
        setUser(res.data);
        setView('dashboard');
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('landing');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F5F5F4]">
      <Loader2 className="animate-spin text-[#141414]" size={48} />
    </div>
  );

  return (
    <div className="antialiased">
      {view === 'landing' && <LandingPage onGetStarted={() => setView('auth')} />}
      {view === 'auth' && <AuthPage onSuccess={(u) => { setUser(u); setView('dashboard'); }} />}
      {view === 'dashboard' && <Dashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}
