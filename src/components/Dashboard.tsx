import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { 
  LayoutDashboard, BarChart3, TrendingDown, Settings, LogOut, Zap, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, Download, Upload, Info, Cpu, Building2, Plus, Loader2
} from 'lucide-react';
import { authService, buildingService, energyService } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Dashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingBuilding, setIsAddingBuilding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const res = await buildingService.list();
      setBuildings(res.data);
      if (res.data.length > 0) {
        setSelectedBuilding(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBuilding) {
      fetchForecast(selectedBuilding.id);
    }
  }, [selectedBuilding]);

  const fetchForecast = async (id: number) => {
    try {
      const res = await energyService.getForecast(id);
      setForecast(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    try {
      const res = await buildingService.create({ name, address });
      setBuildings([...buildings, res.data]);
      setSelectedBuilding(res.data);
      setIsAddingBuilding(false);
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { label: 'Current Load', value: '142 kW', change: '+2.4%', trend: 'up', icon: Zap },
    { label: 'Est. Daily Cost', value: forecast ? `₹${forecast.estimated_cost.toLocaleString()}` : '...', change: '-5.1%', trend: 'down', icon: BarChart3 },
    { label: 'Peak Alert', value: forecast?.peak_detected ? 'CRITICAL' : 'NORMAL', change: forecast?.peak_detected ? 'Alert' : 'Safe', trend: forecast?.peak_detected ? 'warning' : 'up', icon: AlertTriangle },
    { label: 'Savings Potential', value: forecast ? `₹${(forecast.recommended_load_reduction * 100).toLocaleString()}` : '...', change: '+12%', trend: 'up', icon: TrendingDown },
  ];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F5F5F4]">
      <Loader2 className="animate-spin text-[#141414]" size={48} />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F5F5F4] text-[#141414] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#141414]/10 bg-white flex flex-col">
        <div className="p-6 border-b border-[#141414]/10 flex items-center gap-2">
          <Zap className="w-6 h-6 fill-[#141414]" />
          <span className="text-lg font-bold uppercase tracking-tighter">VoltWise AI</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <NavItem icon={<TrendingDown size={20} />} label="Optimization" active={activeTab === 'optimization'} onClick={() => setActiveTab('optimization')} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-[#141414]/10">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#141414]/10 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select 
                value={selectedBuilding?.id || ''}
                onChange={(e) => setSelectedBuilding(buildings.find(b => b.id === parseInt(e.target.value)))}
                className="appearance-none bg-[#F5F5F4] border-none rounded-xl px-4 py-2 pr-10 text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-[#141414] outline-none cursor-pointer"
              >
                {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                {buildings.length === 0 && <option disabled>No Buildings</option>}
              </select>
              <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={16} />
            </div>
            <button 
              onClick={() => setIsAddingBuilding(true)}
              className="p-2 bg-[#141414]/5 hover:bg-[#141414]/10 rounded-xl transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold uppercase tracking-widest opacity-40">Plan: {user?.tier}</p>
              <p className="text-sm font-bold">{user?.email}</p>
            </div>
            <button 
              onClick={() => setIsUploading(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#141414] rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#141414] hover:text-[#E4E3E0] transition-all"
            >
              <Upload size={16} />
              Import Data
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {buildings.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <Building2 size={64} className="opacity-10 mb-6" />
              <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">No Buildings Added</h2>
              <p className="opacity-50 mb-8 max-w-sm">Start by adding your first commercial facility to begin energy intelligence tracking.</p>
              <button 
                onClick={() => setIsAddingBuilding(true)}
                className="px-8 py-4 bg-[#141414] text-[#E4E3E0] rounded-full font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <Plus size={20} /> Add Building
              </button>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-white border border-[#141414]/10 rounded-2xl shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-[#141414]/5 rounded-lg">
                        <stat.icon size={20} className={stat.trend === 'warning' ? 'text-orange-500' : ''} />
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                        stat.trend === 'up' ? "bg-emerald-100 text-emerald-700" : 
                        stat.trend === 'down' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                      )}>
                        {stat.trend === 'up' ? <ArrowUpRight size={12} /> : stat.trend === 'down' ? <ArrowDownRight size={12} /> : null}
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-xs uppercase tracking-widest opacity-50 mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Main Chart Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 bg-white border border-[#141414]/10 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-tight">Energy Consumption Forecast</h3>
                      <p className="text-sm opacity-50">AI predicted demand for the next 24 hours</p>
                    </div>
                  </div>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecast?.forecast?.map((val: number, i: number) => ({ hour: `${i}:00`, consumption: val }))}>
                        <defs>
                          <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={forecast?.peak_detected ? "#f97316" : "#141414"} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={forecast?.peak_detected ? "#f97316" : "#141414"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Area 
                          type="monotone" 
                          dataKey="consumption" 
                          stroke={forecast?.peak_detected ? "#f97316" : "#141414"} 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorCons)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Insights Sidebar */}
                <div className="space-y-6">
                  <div className="p-8 bg-[#141414] text-[#E4E3E0] rounded-2xl shadow-xl overflow-hidden relative">
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
                      <Cpu size={20} />
                      AI Optimization
                    </h3>
                    <div className="space-y-6 relative z-10">
                      {forecast?.peak_detected ? (
                        <InsightItem 
                          title="Peak Shaving Alert"
                          description="Critical peak detected. Shift HVAC load immediately to avoid demand charges."
                          impact={`₹${(forecast.recommended_load_reduction * 100).toLocaleString()} saved`}
                        />
                      ) : (
                        <InsightItem 
                          title="Optimal Load"
                          description="Your current load profile is within efficient limits. No immediate action required."
                          impact="Stable"
                        />
                      )}
                      <button className="w-full py-3 bg-[#E4E3E0] text-[#141414] rounded-full font-bold uppercase tracking-wider text-sm hover:scale-[1.02] transition-transform">
                        View Detailed Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Add Building Modal */}
      <AnimatePresence>
        {isAddingBuilding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingBuilding(false)} className="absolute inset-0 bg-[#141414]/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Add New Facility</h2>
              <p className="text-sm opacity-50 mb-8">Register a new commercial building for tracking.</p>
              <form onSubmit={handleAddBuilding} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Building Name</label>
                  <input name="name" required className="w-full px-4 py-3 bg-[#F5F5F4] border-none rounded-xl focus:ring-2 focus:ring-[#141414] outline-none" placeholder="e.g. Mumbai Central Mall" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Address</label>
                  <input name="address" required className="w-full px-4 py-3 bg-[#F5F5F4] border-none rounded-xl focus:ring-2 focus:ring-[#141414] outline-none" placeholder="e.g. Worli, Mumbai" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsAddingBuilding(false)} className="flex-grow py-4 border border-[#141414] rounded-full font-bold uppercase tracking-wider text-sm">Cancel</button>
                  <button type="submit" className="flex-grow py-4 bg-[#141414] text-[#E4E3E0] rounded-full font-bold uppercase tracking-wider text-sm">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal Simulation */}
      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUploading(false)} className="absolute inset-0 bg-[#141414]/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Import Smart Meter Data</h2>
              <p className="text-sm opacity-50 mb-8">Upload your 15-minute interval CSV or Excel file.</p>
              <div className="border-2 border-dashed border-[#141414]/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-[#141414]/40 transition-colors cursor-pointer">
                <div className="p-4 bg-[#141414]/5 rounded-full"><Upload size={32} /></div>
                <div className="text-center">
                  <p className="font-bold uppercase tracking-wider text-sm">Drop file here</p>
                  <p className="text-xs opacity-50">or click to browse</p>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button onClick={() => setIsUploading(false)} className="flex-grow py-4 border border-[#141414] rounded-full font-bold uppercase tracking-wider text-sm">Cancel</button>
                <button onClick={() => setIsUploading(false)} className="flex-grow py-4 bg-[#141414] text-[#E4E3E0] rounded-full font-bold uppercase tracking-wider text-sm">Analyze</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full p-3 text-sm font-medium rounded-xl transition-all",
        active ? "bg-[#141414] text-[#E4E3E0] shadow-lg shadow-[#141414]/20" : "text-[#141414]/60 hover:bg-[#141414]/5"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function InsightItem({ title, description, impact }: { title: string, description: string, impact: string }) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold uppercase tracking-wider">{title}</h4>
        <div className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
          {impact}
        </div>
      </div>
      <p className="text-xs opacity-60 leading-relaxed">{description}</p>
    </div>
  );
}
