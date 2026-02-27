import React from 'react';
import { motion } from 'motion/react';
import { Zap, BarChart3, ShieldCheck, ArrowRight, Building2, TrendingDown, Cpu } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[#141414]">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 fill-[#141414]" />
          <span className="text-xl font-bold uppercase tracking-tighter">VoltWise AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
          <a href="#features" className="hover:opacity-60 transition-opacity">Features</a>
          <a href="#pricing" className="hover:opacity-60 transition-opacity">Pricing</a>
          <button 
            onClick={onGetStarted}
            className="px-4 py-2 bg-[#141414] text-[#E4E3E0] rounded-full hover:opacity-90 transition-opacity"
          >
            Launch Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-8 py-24 md:py-32 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] uppercase tracking-tighter mb-8">
              Cut Electricity <br />
              <span className="italic font-serif normal-case tracking-normal">Bills with</span> <br />
              Intelligence
            </h1>
            <p className="text-xl max-w-md mb-10 opacity-80">
              Predictive energy management for shopping malls, hospitals, and manufacturing units. Save 5-15% on demand charges.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onGetStarted}
                className="group flex items-center gap-2 px-8 py-4 bg-[#141414] text-[#E4E3E0] rounded-full text-lg font-bold uppercase tracking-wider hover:scale-105 transition-transform"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-6 py-4 border border-[#141414] rounded-full">
                <span className="text-sm font-bold uppercase tracking-widest opacity-60">Trusted by</span>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[#141414]/10 border border-[#E4E3E0] flex items-center justify-center">
                      <Building2 className="w-4 h-4 opacity-40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-square bg-[#141414] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-3/4 h-3/4 border border-white/10 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-1/2 h-1/2 border border-white/20 rounded-full flex items-center justify-center">
                    <Zap className="w-16 h-16 text-white" />
                  </div>
               </div>
            </div>
            {/* Floating Stats */}
            <div className="absolute top-10 left-10 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <div className="text-xs uppercase tracking-widest text-white/60 mb-1">Peak Prediction</div>
              <div className="text-2xl font-mono text-white">98.4% Accuracy</div>
            </div>
            <div className="absolute bottom-10 right-10 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <div className="text-xs uppercase tracking-widest text-white/60 mb-1">Avg. Savings</div>
              <div className="text-2xl font-mono text-white">₹4.2L / Month</div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section id="features" className="px-8 py-24 bg-[#141414] text-[#E4E3E0]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">Engineered for <br /><span className="italic font-serif normal-case tracking-normal text-[#E4E3E0]/60">Industrial Scale</span></h2>
            <p className="text-xl opacity-60 max-w-xl">Our AI engine processes smart meter data to optimize your facility's energy footprint in real-time.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-px bg-[#E4E3E0]/10 border border-[#E4E3E0]/10">
            <FeatureCard 
              icon={<Cpu className="w-8 h-8" />}
              title="AI Engine"
              description="CNN + LSTM models for peak load prediction and probabilistic forecasting."
            />
            <FeatureCard 
              icon={<TrendingDown className="w-8 h-8" />}
              title="Peak Shaving"
              description="Automated insights to shift loads and reduce expensive demand charges."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Tariff Engine"
              description="Localized India tariff engine supporting complex multi-slab billing structures."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-8 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">Transparent Pricing</h2>
          <p className="text-xl opacity-60">Choose the plan that fits your facility's scale.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard 
            tier="Basic"
            price="4,999"
            description="Perfect for single building management."
            features={["1 Building", "Real-time Dashboard", "Peak Alerts", "Monthly Reports"]}
          />
          <PricingCard 
            tier="Pro"
            price="19,999"
            description="Optimized for multi-facility operations."
            features={["Up to 5 Buildings", "AI Load Forecasting", "Automated Peak Shaving", "Priority Support"]}
            highlighted
          />
          <PricingCard 
            tier="Enterprise"
            price="Custom"
            description="Bespoke solutions for large-scale chains."
            features={["Unlimited Buildings", "Custom AI Models", "API Integration", "Dedicated Account Manager"]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-[#141414] flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 fill-[#141414]" />
          <span className="text-lg font-bold uppercase tracking-tighter">VoltWise AI</span>
        </div>
        <div className="text-sm opacity-60 uppercase tracking-widest">
          © 2024 VoltWise AI. All rights reserved.
        </div>
        <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-12 bg-[#141414] hover:bg-[#1a1a1a] transition-colors">
      <div className="mb-6 opacity-60">{icon}</div>
      <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">{title}</h3>
      <p className="opacity-60 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ tier, price, description, features, highlighted = false }: { tier: string, price: string, description: string, features: string[], highlighted?: boolean }) {
  return (
    <div className={`p-10 rounded-2xl border border-[#141414] flex flex-col ${highlighted ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-transparent'}`}>
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-60 mb-2">{tier}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">₹{price}</span>
          {price !== 'Custom' && <span className="text-sm opacity-60">/mo</span>}
        </div>
      </div>
      <p className="mb-8 opacity-80">{description}</p>
      <ul className="space-y-4 mb-10 flex-grow">
        {features.map(f => (
          <li key={f} className="flex items-center gap-3 text-sm">
            <ShieldCheck className="w-4 h-4 opacity-60" />
            {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-4 rounded-full font-bold uppercase tracking-wider transition-all ${highlighted ? 'bg-[#E4E3E0] text-[#141414] hover:scale-[1.02]' : 'bg-[#141414] text-[#E4E3E0] hover:scale-[1.02]'}`}>
        Choose {tier}
      </button>
    </div>
  );
}
