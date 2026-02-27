import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../services/api';

interface AuthPageProps {
  onSuccess: (user: any) => void;
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const res = await authService.login({ email, password });
        localStorage.setItem('token', res.data.token);
        onSuccess(res.data.user);
      } else {
        await authService.register({ email, password });
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-[#141414]/5"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-[#141414] rounded-2xl mb-4">
            <Zap className="text-[#E4E3E0]" size={32} />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm opacity-50 uppercase tracking-widest mt-1">
            VoltWise AI Energy Intelligence
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#F5F5F4] border-none rounded-2xl focus:ring-2 focus:ring-[#141414] outline-none transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#F5F5F4] border-none rounded-2xl focus:ring-2 focus:ring-[#141414] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold uppercase tracking-wider text-center">{error}</p>}

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-[#141414] text-[#E4E3E0] rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {isLogin ? 'Sign In' : 'Register'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
