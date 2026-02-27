import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { 
  LayoutDashboard, BarChart3, TrendingDown, Settings, LogOut, Zap, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, Download, Upload, Info, Cpu
} from 'lucide-react';
import { generateMockData, generateForecast } from '../lib/mockData';
import { EnergyData, ForecastData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [data, setData] = useState<EnergyData[]>([]);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const mockData = generateMockData();
    setData(mockData);
    setForecast(generateForecast(mockData));
  }, []);

  const stats = [
    { label: 'Current Load', value: '142 kW', change: '+2.4%', trend: 'up', icon: Zap },
    { label: 'Today\'s Cost', value: '₹12,450', change: '-5.1%', trend: 'down', icon: BarChart3 },
    { label: 'Peak Forecast', value: '185 kW', change: 'Alert', trend: 'warning', icon: AlertTriangle },
    { label: 'Est. Savings', value: '₹4,200', change: '+12%', trend: 'up', icon: TrendingDown },
  ];

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
          <button className="flex items-center gap-3 w-full p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#141414]/10 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">Main Facility Dashboard</h1>
            <p className="text-xs opacity-50 uppercase tracking-widest">Mumbai Central Mall • Building A</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsUploading(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#141414] rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#141414] hover:text-[#E4E3E0] transition-all"
            >
              <Upload size={16} />
              Import Data
            </button>
            <div className="w-10 h-10 rounded-full bg-[#141414] text-[#E4E3E0] flex items-center justify-center font-bold">
              JD
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
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
                  <p className="text-sm opacity-50">Real-time load vs AI predicted demand (24h)</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <div className="w-3 h-3 rounded-full bg-[#141414]" /> Actual
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <div className="w-3 h-3 rounded-full bg-[#141414]/20" /> Forecast
                  </div>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecast}>
                    <defs>
                      <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(val) => val.split(' ')[1]} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#999' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#999' }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="predictedConsumption" 
                      stroke="#141414" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fillOpacity={1} 
                      fill="url(#colorCons)" 
                      name="Forecast"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#141414" 
                      strokeWidth={3}
                      fillOpacity={0}
                      name="Actual"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights Sidebar */}
            <div className="space-y-6">
              <div className="p-8 bg-[#141414] text-[#E4E3E0] rounded-2xl shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap size={120} />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
                  <Cpu size={20} />
                  AI Optimization
                </h3>
                <div className="space-y-6 relative z-10">
                  <InsightItem 
                    title="Peak Shaving Alert"
                    description="Predicted peak at 14:00 (185kW). Shift HVAC load to 12:00."
                    impact="₹1,200 saved"
                  />
                  <InsightItem 
                    title="Load Shifting"
                    description="Manufacturing Unit B can shift non-critical operations to 22:00."
                    impact="₹3,500 saved"
                  />
                  <button className="w-full py-3 bg-[#E4E3E0] text-[#141414] rounded-full font-bold uppercase tracking-wider text-sm hover:scale-[1.02] transition-transform">
                    Apply All Recommendations
                  </button>
                </div>
              </div>

              <div className="p-8 bg-white border border-[#141414]/10 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold uppercase tracking-tight mb-6">Cost Distribution</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={forecast.slice(0, 6)}>
                      <XAxis dataKey="timestamp" hide />
                      <Tooltip cursor={{ fill: 'transparent' }} />
                      <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                        {forecast.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#141414' : '#14141440'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between text-xs font-bold uppercase tracking-widest opacity-50">
                  <span>Fixed Charges</span>
                  <span>Variable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal Simulation */}
      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploading(false)}
              className="absolute inset-0 bg-[#141414]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Import Smart Meter Data</h2>
              <p className="text-sm opacity-50 mb-8">Upload your 15-minute interval CSV or Excel file.</p>
              
              <div className="border-2 border-dashed border-[#141414]/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-[#141414]/40 transition-colors cursor-pointer">
                <div className="p-4 bg-[#141414]/5 rounded-full">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="font-bold uppercase tracking-wider text-sm">Drop file here</p>
                  <p className="text-xs opacity-50">or click to browse</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => setIsUploading(false)}
                  className="flex-grow py-4 border border-[#141414] rounded-full font-bold uppercase tracking-wider text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsUploading(false)}
                  className="flex-grow py-4 bg-[#141414] text-[#E4E3E0] rounded-full font-bold uppercase tracking-wider text-sm"
                >
                  Analyze
                </button>
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
