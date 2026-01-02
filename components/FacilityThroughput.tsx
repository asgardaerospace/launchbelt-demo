
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  DollarSign, Activity, TrendingUp, Gauge, 
  AlertTriangle, CheckCircle2, Zap, Hammer, 
  ArrowUpRight, Clock, Box, Target, Layers, 
  Truck, ArrowRight, BarChart3, Sparkles,
  ArrowLeft, ChevronRight, Info, LayoutGrid,
  Cpu, Thermometer, Database, Search, Filter,
  ShieldCheck, MapPin, 
  History as HistoryIcon
} from 'lucide-react';

// --- RECONCILED MOCK DATA ---

const MOCK_WIP_ITEMS = [
  { id: 'WO-9921', part: '7721-001', val: 1200000, status: 'Integration', owner: 'D. Miller', node: 'CNC-01' },
  { id: 'WO-8804', part: '8802-C-105', val: 1050000, status: 'Curing', owner: 'A. Chen', node: 'Thermal-C' },
  { id: 'WO-9012', part: '9011-042', val: 850000, status: 'Testing', owner: 'S. Connor', node: 'Additive-A' },
  { id: 'WO-1122', part: '1122-005', val: 680000, status: 'Assembly', owner: 'K. Vance', node: 'Assembly-4' },
  { id: 'WO-2047', part: '2047-010', val: 420000, status: 'Machining', owner: 'R. Rivera', node: 'CNC-01' },
]; // SUM = $4.2M

const MOCK_COMPLETED_OPS = [
  { id: 'WO-9910', part: '7721-001-F', time: '10:42', val: 650000, node: 'CNC-01', status: 'SUCCESS' },
  { id: 'WO-8801', part: '8802-C-102', time: '09:15', val: 450000, node: 'Thermal-C', status: 'SUCCESS' },
  { id: 'WO-9005', part: '9011-038-B', time: '08:00', val: 300000, node: 'Additive-A', status: 'SUCCESS' },
]; // SUM = $1.4M

const MOCK_GATED_ITEMS = [
  { id: 'WO-8804', part: '8802-C-105', val: 420000, status: 'GATED', owner: 'A. Chen', node: 'Thermal-C', reason: 'Material Shortage' },
  { id: 'WO-2047', part: '2047-010', val: 430000, status: 'GATED', owner: 'R. Rivera', node: 'CNC-01', reason: 'Quality Hold' },
]; // SUM = $850K

const THROUGHPUT_DATA = [
  { name: 'Mon', throughput: 1.2, goal: 1.5, util: 82 },
  { name: 'Tue', throughput: 1.8, goal: 1.5, util: 94 },
  { name: 'Wed', throughput: 1.4, goal: 1.5, util: 78 },
  { name: 'Thu', throughput: 1.6, goal: 1.5, util: 88 },
  { name: 'Fri', throughput: 1.1, goal: 1.5, util: 65 },
  { name: 'Sat', throughput: 0.9, goal: 1.5, util: 42 },
  { name: 'Sun', throughput: 0.5, goal: 1.5, util: 20 },
];

const STATION_VALUE_DATA = [
  { name: 'CNC-01', value: 1620, util: 92, type: '5-Axis Machining', hourlyVal: 4500 },
  { name: 'Additive-A', value: 850, util: 45, type: 'SLS Production', hourlyVal: 2200 },
  { name: 'Assembly-4', value: 680, util: 78, type: 'Final Integration', hourlyVal: 1800 },
  { name: 'QC-Node', value: 0, util: 98, type: 'System Verification', hourlyVal: 3200 },
  { name: 'Thermal-C', value: 1050, util: 62, type: 'Autoclave Curing', hourlyVal: 5500 },
]; // Adjusted to match WIP Valuation breakdown: 1200+420 (CNC) + 1050 (Thermal) + 850 (Additive) + 680 (Assembly) = 4200

type MetricType = 'WIP_VALUE' | 'DAILY_TP' | 'UTILIZATION' | 'GATED_VALUE';

// --- MAIN COMPONENT ---

const FacilityThroughput: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const metrics = [
    { id: 'WIP_VALUE' as MetricType, label: 'Active WIP Value', val: '$4.2M', sub: '24 Units in Work', color: 'text-white', icon: Box },
    { id: 'DAILY_TP' as MetricType, label: 'Daily Throughput', val: '$1.4M', sub: 'Avg vs $1.5M Goal', color: 'text-primary', icon: Zap },
    { id: 'UTILIZATION' as MetricType, label: 'Asset Utilization', val: '78.4%', sub: 'Fleet-wide Average', color: 'text-emerald-400', icon: Gauge },
    { id: 'GATED_VALUE' as MetricType, label: 'Gated Value', val: '$850K', sub: 'Blocked by Supply', color: 'text-red-500', icon: AlertTriangle },
  ];

  if (selectedMetric) {
    return <MetricDrilldown metric={selectedMetric} onBack={() => setSelectedMetric(null)} />;
  }

  if (selectedNodeId) {
    const node = STATION_VALUE_DATA.find(s => s.name === selectedNodeId);
    return <AssetDrilldown node={node} onBack={() => setSelectedNodeId(null)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">Forge-Owned</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Facility Throughput Economics
          </h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Asgard Forge: Austin • Real-time Output & Velocity</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-xl">
           <Activity className="w-4 h-4 animate-pulse" />
           OUTPUT SYNC: ACTIVE
        </div>
      </div>

      {/* Facility Economic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {metrics.map(m => (
          <button 
            key={m.id} 
            onClick={() => setSelectedMetric(m.id)}
            className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-all text-left"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-all">
              <m.icon className="w-12 h-12 text-primary" />
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 italic leading-none">{m.label}</p>
            <p className={`text-4xl font-bold ${m.color} tracking-tighter leading-none mb-3`}>{m.val}</p>
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">{m.sub}</p>
            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between text-[8px] font-black text-slate-600 group-hover:text-primary transition-colors">
              VIEW CONTRIBUTING NODES
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
        {/* Weekly Throughput Velocity */}
        <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl">
          <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
            <h3 className="text-xl font-bold text-white uppercase italic tracking-tight flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" />
              Throughput Velocity ($M/Day)
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase italic">
               Goal: $1.5M Output
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={THROUGHPUT_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  cursor={{ fill: '#1e293b' }}
                />
                <Bar dataKey="throughput" radius={[4, 4, 0, 0]}>
                  {THROUGHPUT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.throughput >= entry.goal ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="goal" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WIP Flow & Bottlenecks */}
        <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-48 h-48 text-primary" />
           </div>
           <h3 className="text-xl font-bold text-white uppercase italic tracking-tight mb-10 border-b border-slate-800 pb-4 relative z-10">
              Flow Dynamics & Blocker Impact
           </h3>
           <div className="space-y-6 flex-1 relative z-10">
              <button 
                onClick={() => setSelectedNodeId('CNC-01')}
                className="w-full text-left flex gap-6 group p-4 hover:bg-slate-800/40 rounded-3xl transition-all border border-transparent hover:border-slate-700"
              >
                 <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Current Velocity</p>
                    <p className="text-base font-bold text-white uppercase italic">Nominal Flow in Station CNC-01</p>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed italic">Contributing $1.6M to current WIP valuation. Efficiency tracking at 92%.</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-primary transition-all self-center" />
              </button>
              <div className="flex gap-6 group p-4 hover:bg-slate-800/40 rounded-3xl transition-all border border-transparent hover:border-slate-700">
                 <div className="p-4 bg-red-500/10 rounded-2xl text-red-400 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Gating Issue</p>
                    <p className="text-base font-bold text-red-400 uppercase italic">Material Shortage: Titanium Alloy (SHIP-0994)</p>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed italic">Economic impact: $420K in WIP stalled. Projected recovery window: Nov 24.</p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedMetric('DAILY_TP')}
                className="w-full text-left flex gap-6 group p-4 hover:bg-slate-800/40 rounded-3xl transition-all border border-transparent hover:border-slate-700"
              >
                 <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Release Opportunity</p>
                    <p className="text-base font-bold text-white uppercase italic">Final Release Hub Acceptance</p>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed italic">Daily output achieved $1.4M following successful test sign-off for 03 units.</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-primary transition-all self-center" />
              </button>
           </div>
        </div>
      </div>

      {/* Asset Economic Performance */}
      <div className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl mx-2">
         <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter flex items-center gap-3">
               <Layers className="w-6 h-6 text-primary" />
               Asset Economic Contribution Matrix
            </h3>
            <div className="flex gap-2">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl italic">Austin Node Fleet</span>
            </div>
         </div>
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-800/30 border-b border-slate-800">
                  <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Asset Identity</th>
                  <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">WIP Value On-Dock</th>
                  <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Util Rate</th>
                  <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">FPY Efficiency</th>
                  <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-right">Throughput Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
               {STATION_VALUE_DATA.map(s => (
                 <tr 
                  key={s.name} 
                  onClick={() => setSelectedNodeId(s.name)}
                  className="hover:bg-slate-800/30 transition-all cursor-pointer group"
                 >
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-primary italic transition-all group-hover:border-primary/50 group-hover:scale-110">
                            <Cpu className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-base font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors italic leading-none mb-1">{s.name}</p>
                             <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{s.type}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <span className="text-sm font-bold text-white italic">${s.value}K</span>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <div className="flex flex-col items-center gap-1.5">
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-primary" style={{ width: `${s.util}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-slate-500">{s.util}%</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-center text-[11px] font-bold text-emerald-400 italic">98.2%</td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-4">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest ${s.util > 80 ? 'bg-primary/10 text-primary border-primary/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                            {s.util > 80 ? 'HIGH OUTPUT' : 'AVAILABLE'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: METRIC DRILLDOWN ---

const MetricDrilldown: React.FC<{ metric: MetricType, onBack: () => void }> = ({ metric, onBack }) => {
  const meta = {
    WIP_VALUE: { label: 'Active WIP Valuation', icon: Box, color: 'text-white', total: '$4,200,000' },
    DAILY_TP: { label: 'Daily Throughput Performance', icon: Zap, color: 'text-primary', total: '$1,400,000' },
    UTILIZATION: { label: 'Fleet Utilization Audit', icon: Gauge, color: 'text-emerald-400', total: '78.4% AVG' },
    GATED_VALUE: { label: 'Production Blockage (Gated Value)', icon: AlertTriangle, color: 'text-red-500', total: '$850,000' },
  }[metric];

  const currentData = useMemo(() => {
    if (metric === 'WIP_VALUE') return MOCK_WIP_ITEMS;
    if (metric === 'DAILY_TP') return MOCK_COMPLETED_OPS;
    if (metric === 'GATED_VALUE') return MOCK_GATED_ITEMS;
    // For Utilization, show the station data
    return STATION_VALUE_DATA;
  }, [metric]);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 px-2">
        <button onClick={onBack} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-slate-800">
          <HistoryIcon className="w-6 h-6 rotate-180" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic flex items-center gap-3">
            <meta.icon className={`w-8 h-8 ${meta.color}`} />
            {meta.label}
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Detailed Economic Traceability • 24h Window</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
                 <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">Contributing Elements</h3>
                 <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner text-right">
                       <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Aggregate Total</p>
                       <p className={`text-xl font-black italic ${meta.color}`}>{meta.total}</p>
                    </div>
                 </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/20 border-b border-slate-800">
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase">Item/Reference</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase text-center">Node</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">Value Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {currentData.map((item: any, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-all">
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-white italic uppercase">{item.id || item.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                          {item.part || item.type || 'System Operation'}
                        </p>
                        {item.reason && <p className="text-[8px] text-red-400 font-black uppercase mt-1 italic leading-none">{item.reason}</p>}
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.node || item.name}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <span className="text-sm font-black text-primary italic">
                            {metric === 'UTILIZATION' ? `${item.util}%` : `$${(item.val || item.value * 1000).toLocaleString()}`}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </section>
        </div>

        <div className="space-y-8">
           <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles className="w-24 h-24 text-primary" /></div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 italic border-b border-slate-800 pb-6 flex items-center gap-3">
                 <Sparkles className="w-4 h-4 text-primary" /> AI Economic Brief
              </h4>
              <div className="space-y-8">
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-4">
                  <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
                    {metric === 'WIP_VALUE' && '"Current WIP value is reconciled at $4.2M. Majority of valuation is locked in High-Complexity Machining steps for WP-8804."'}
                    {metric === 'DAILY_TP' && '"Throughput realized today is driven by successful close-out of 03 major sub-assemblies totalling $1.4M."'}
                    {metric === 'UTILIZATION' && '"Fleet utilization is trending upwards. Station CNC-01 has maintained 92% uptime during current shift with zero reported faults."'}
                    {metric === 'GATED_VALUE' && '"Critical shortage of Titanium hex-bolts and quality holds on WP-2047 drive the $850K gated value."'}
                  </p>
                </div>
              </div>
           </section>

           <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 italic">Audit Verification</h4>
              <div className="space-y-6">
                 <div className="flex items-center gap-4 text-slate-600">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest italic leading-relaxed">Economic data verified via L5 ledger sync. All drill-down totals are matched to KPI values.</p>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: ASSET DRILLDOWN ---

const AssetDrilldown: React.FC<{ node: any, onBack: () => void }> = ({ node, onBack }) => {
  if (!node) {
    return (
      <div className="space-y-8 p-10 text-center animate-in fade-in duration-500">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest mb-10">
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </button>
        <div className="max-w-md mx-auto space-y-4">
           <Info className="w-16 h-16 text-slate-700 mx-auto" />
           <h3 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Node Data Pending</h3>
           <p className="text-slate-500 text-sm italic">Detailed telemetry for this asset is currently being synced from the edge. Please select another node.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-6 px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Economic Matrix
        </button>

        <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
           <div className="relative z-10 flex items-center gap-12">
              <div className="p-12 bg-slate-950/60 rounded-[48px] border border-slate-800 shadow-2xl relative group">
                 <Cpu className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center animate-pulse shadow-xl">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                 </div>
              </div>
              <div>
                 <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">Operational Node</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{node.type || 'Generic Asset'}</span>
                 </div>
                 <h3 className="text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{node.name}</h3>
                 <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Location: Austin Forge • Floor A</span>
                    <span className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-4 h-4" /> Performance: HIGH OUTPUT</span>
                 </div>
              </div>
           </div>
           <div className="relative z-10 text-right lg:border-l lg:border-slate-800 lg:pl-12 h-full flex flex-col justify-center">
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest block mb-3 italic">Economic Weight</span>
              <p className="text-5xl font-black tracking-tighter italic text-white">${node.hourlyVal || '0'}/hr</p>
              <div className="mt-4 flex items-center justify-end gap-2 text-primary font-black text-xs uppercase italic tracking-widest">
                 FPY Rate: 99.8%
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
         <div className="lg:col-span-2 space-y-8">
            <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
               <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary" /> Asset Workstream
               </h4>
               <div className="space-y-6">
                  {/* Active Job */}
                  <div className="p-8 bg-primary/5 border border-primary/20 rounded-[40px] flex justify-between items-center group shadow-xl">
                     <div className="flex items-center gap-6">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary animate-pulse border border-primary/20">
                           <Activity className="w-8 h-8" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase italic mb-1 tracking-widest">Actively Processing</p>
                           <h5 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">WO-9921</h5>
                           <p className="text-[9px] text-slate-600 font-bold uppercase mt-2">Valuation: $1,200,000.00 • Completion: 92%</p>
                        </div>
                     </div>
                     <ChevronRight className="w-8 h-8 text-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                  </div>
                  
                  {/* Queued Work */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {['WO-1122', 'WO-2047'].map(q => (
                       <div key={q} className="p-6 bg-slate-950 border border-slate-800 rounded-3xl flex justify-between items-center group hover:border-slate-600 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-700 font-black text-xs italic">Q</div>
                             <div>
                                <p className="text-sm font-bold text-white uppercase italic">{q}</p>
                                <p className="text-[9px] text-slate-600 font-bold uppercase mt-0.5">Est. Start: Today 18:00</p>
                             </div>
                          </div>
                          <Clock className="w-4 h-4 text-slate-800 group-hover:text-primary transition-colors" />
                       </div>
                     ))}
                  </div>

                  {/* Recently Completed */}
                  <div className="pt-6 border-t border-slate-800">
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-6">Recently Released from Node</p>
                     <div className="space-y-3">
                        {['WO-9910-F', 'WO-8801-C'].map(c => (
                          <div key={c} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-2xl border border-slate-700">
                             <div className="flex items-center gap-4">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold text-slate-300 uppercase italic">{c}</span>
                             </div>
                             <span className="text-xs font-black text-slate-500 italic">Value: $650K</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>
         </div>

         <div className="space-y-8">
            <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles className="w-24 h-24 text-primary" /></div>
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 italic border-b border-slate-800 pb-6 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-primary" /> AI Node Insight
               </h4>
               <div className="space-y-8">
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-4">
                    <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                      "Node <span className="text-white">{node.name}</span> is performing at peak efficiency. Predictive maintenance suggests a filter refresh in <span className="text-amber-400">142h</span>. No performance degradation detected."
                    </p>
                  </div>
                  <div className="space-y-4 pt-4">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-2 mb-4">Economic Yield Rate</p>
                     <div className="flex justify-between items-center text-xs font-bold uppercase italic">
                        <span className="text-slate-500">Utilization Rate</span>
                        <span className="text-primary">{node.util || '0'}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${node.util || 0}%` }} />
                     </div>
                     <div className="flex justify-between items-center text-xs font-bold uppercase italic mt-6">
                        <span className="text-slate-500">FPY Confidence</span>
                        <span className="text-emerald-400">99.8%</span>
                     </div>
                  </div>
               </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark" />
               <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 italic">Asset Baseline</h4>
               <div className="space-y-6">
                  <div className="flex items-center gap-4 text-slate-600">
                     <ShieldCheck className="w-5 h-5 text-emerald-400" />
                     <p className="text-[10px] font-bold uppercase tracking-widest italic leading-relaxed">System calibration is audit-verified and cryptographically synced.</p>
                  </div>
                  <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-2xl text-[10px] uppercase tracking-widest border border-slate-700 transition-all flex items-center justify-center gap-3">
                     <HistoryIcon className="w-4 h-4" /> View Calibration Log
                  </button>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
};

export default FacilityThroughput;
