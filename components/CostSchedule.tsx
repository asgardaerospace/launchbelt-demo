
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  DollarSign, Clock, TrendingUp, ArrowUpRight, 
  AlertTriangle, CheckCircle2, Zap, Target,
  BarChart3, Layers, Briefcase, Activity,
  ArrowLeft, ChevronRight, Calendar, Info,
  ShieldCheck, AlertCircle, FileText, Sparkles
} from 'lucide-react';

// --- TYPES ---
interface ProgramFinance {
  id: string;
  name: string;
  category: string;
  totalBudget: number;
  committed: number;
  inExecution: number;
  delivered: number;
  status: 'NOMINAL' | 'AT_RISK' | 'CRITICAL';
  scheduleVariance: number; // Days
  milestones: { label: string; planned: string; expected: string; status: 'DONE' | 'ACTIVE' | 'PENDING' | 'DELAYED' }[];
  scurve: { week: string; planned: number; actual: number }[];
}

// --- RECONCILED DEMO DATA ---
const MOCK_PROGRAMS: ProgramFinance[] = [
  {
    id: 'PRG-FH-01',
    name: 'Falcon-Heavy Expansion',
    category: 'Orbital Logistics',
    totalBudget: 45.0,
    committed: 40.2,
    inExecution: 15.5,
    delivered: 22.4,
    status: 'NOMINAL',
    scheduleVariance: -2,
    milestones: [
      { label: 'Primary Structure CDR', planned: 'Oct 15', expected: 'Oct 12', status: 'DONE' },
      { label: 'Core Integration', planned: 'Nov 20', expected: 'Nov 20', status: 'ACTIVE' },
      { label: 'Final Test Release', planned: 'Dec 15', expected: 'Dec 15', status: 'PENDING' },
      { label: 'Mission Delivery', planned: 'Jan 10', expected: 'Jan 10', status: 'PENDING' },
    ],
    scurve: [
      { week: 'W1', planned: 5, actual: 4.8 },
      { week: 'W2', planned: 12, actual: 11.5 },
      { week: 'W3', planned: 18, actual: 18.2 },
      { week: 'W4', planned: 25, actual: 24.5 },
      { week: 'W5', planned: 35, actual: 32.4 },
      { week: 'W6', planned: 45, actual: 40.2 },
    ]
  },
  {
    id: 'PRG-SS-02',
    name: 'Starship Infrastructure',
    category: 'Surface Ops',
    totalBudget: 35.0,
    committed: 28.5,
    inExecution: 12.8,
    delivered: 8.2,
    status: 'AT_RISK',
    scheduleVariance: 14,
    milestones: [
      { label: 'Bay Construction', planned: 'Oct 01', expected: 'Oct 10', status: 'DONE' },
      { label: 'Fuel System Proof', planned: 'Nov 05', expected: 'Nov 19', status: 'ACTIVE' },
      { label: 'Avionics Power-up', planned: 'Dec 01', expected: 'Dec 15', status: 'DELAYED' },
    ],
    scurve: [
      { week: 'W1', planned: 4, actual: 3.5 },
      { week: 'W2', planned: 8, actual: 7.2 },
      { week: 'W3', planned: 15, actual: 12.0 },
      { week: 'W4', planned: 22, actual: 18.5 },
      { week: 'W5', planned: 28, actual: 24.0 },
      { week: 'W6', planned: 35, actual: 28.5 },
    ]
  },
  {
    id: 'PRG-NO-04',
    name: 'NightOwl Surveillance V4',
    category: 'Persistent ISR',
    totalBudget: 20.0,
    committed: 19.2,
    inExecution: 10.4,
    delivered: 4.5,
    status: 'CRITICAL',
    scheduleVariance: 28,
    milestones: [
      { label: 'Optics Subsystem CDR', planned: 'Oct 20', expected: 'Oct 20', status: 'DONE' },
      { label: 'Sensor Integration', planned: 'Nov 12', expected: 'Dec 10', status: 'DELAYED' },
      { label: 'System Validation', planned: 'Dec 20', expected: 'Jan 25', status: 'PENDING' },
    ],
    scurve: [
      { week: 'W1', planned: 2, actual: 2.1 },
      { week: 'W2', planned: 6, actual: 5.8 },
      { week: 'W3', planned: 10, actual: 9.2 },
      { week: 'W4', planned: 14, actual: 12.5 },
      { week: 'W5', planned: 18, actual: 16.0 },
      { week: 'W6', planned: 20, actual: 19.2 },
    ]
  },
  {
    id: 'PRG-VE-02',
    name: 'Voyager Explorer Block II',
    category: 'Deep Space',
    totalBudget: 12.0,
    committed: 10.1,
    inExecution: 4.2,
    delivered: 4.8,
    status: 'NOMINAL',
    scheduleVariance: 0,
    milestones: [
      { label: 'RTG Certification', planned: 'Oct 30', expected: 'Oct 30', status: 'DONE' },
      { label: 'Antenna Deployment', planned: 'Nov 25', expected: 'Nov 25', status: 'PENDING' },
    ],
    scurve: [
      { week: 'W1', planned: 1, actual: 0.8 },
      { week: 'W2', planned: 3, actual: 2.5 },
      { week: 'W3', planned: 6, actual: 5.8 },
      { week: 'W4', planned: 9, actual: 8.5 },
      { week: 'W5', planned: 11, actual: 10.1 },
      { week: 'W6', planned: 12, actual: 10.1 },
    ]
  },
  {
    id: 'PRG-CLR-01',
    name: 'Cis-Lunar Relay Phase 1',
    category: 'Lunar Comms',
    totalBudget: 8.0,
    committed: 5.0,
    inExecution: 2.1,
    delivered: 1.1,
    status: 'NOMINAL',
    scheduleVariance: 2,
    milestones: [
      { label: 'Ground Node Alpha', planned: 'Nov 01', expected: 'Nov 03', status: 'DONE' },
      { label: 'Terminal Uplink', planned: 'Dec 10', expected: 'Dec 10', status: 'PENDING' },
    ],
    scurve: [
      { week: 'W1', planned: 0.5, actual: 0.4 },
      { week: 'W2', planned: 1.5, actual: 1.2 },
      { week: 'W3', planned: 3.0, actual: 2.8 },
      { week: 'W4', planned: 5.0, actual: 4.5 },
      { week: 'W5', planned: 7.0, actual: 5.0 },
      { week: 'W6', planned: 8.0, actual: 5.0 },
    ]
  }
];

const CostSchedule: React.FC = () => {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const totalMetrics = useMemo(() => ({
    budget: 120.0,
    committed: MOCK_PROGRAMS.reduce((acc, p) => acc + p.committed, 0),
    execution: MOCK_PROGRAMS.reduce((acc, p) => acc + p.inExecution, 0),
    delivered: MOCK_PROGRAMS.reduce((acc, p) => acc + p.delivered, 0)
  }), []);

  const selectedProgram = useMemo(() => 
    MOCK_PROGRAMS.find(p => p.id === selectedProgramId)
  , [selectedProgramId]);

  if (selectedProgram) {
    return <ProgramDrilldown program={selectedProgram} onBack={() => setSelectedProgramId(null)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Program Portfolio Control
          </h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Engineering Leadership Oversight • $120.0M Total Capital Distribution</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-xl">
           <Activity className="w-4 h-4 animate-pulse" />
           LEDGER SYNC: NOMINAL
        </div>
      </div>

      {/* Portfolio Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {[
          { label: 'Total Portfolio Budget', val: `$${totalMetrics.budget.toFixed(1)}M`, sub: '5 Active Programs', color: 'text-white', icon: Briefcase },
          { label: 'Total Committed Spend', val: `$${totalMetrics.committed.toFixed(1)}M`, sub: 'Contracted / Work Ordered', color: 'text-primary', icon: Target },
          { label: 'Value In Execution', val: `$${totalMetrics.execution.toFixed(1)}M`, sub: 'Active WIP Valuation', color: 'text-emerald-400', icon: Zap },
          { label: 'Completed / Delivered', val: `$${totalMetrics.delivered.toFixed(1)}M`, sub: 'Final Gate Acceptance', color: 'text-indigo-400', icon: ShieldCheck },
        ].map(m => (
          <div key={m.label} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <m.icon className="w-12 h-12 text-primary" />
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 italic leading-none">{m.label}</p>
            <p className={`text-4xl font-bold ${m.color} tracking-tighter leading-none mb-3`}>{m.val}</p>
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Program Portfolio Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl mx-2">
         <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter flex items-center gap-3">
               <Layers className="w-6 h-6 text-primary" />
               Program Performance Matrix
            </h3>
            <div className="flex gap-2">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl italic">Active Programs</span>
            </div>
         </div>
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-800/30 border-b border-slate-800">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Program Identity</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Approved Budget</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Committed</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Execution</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Delivered</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Remaining</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Schedule Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
               {MOCK_PROGRAMS.map(p => (
                 <tr 
                  key={p.id} 
                  onClick={() => setSelectedProgramId(p.id)}
                  className="hover:bg-slate-800/30 transition-all cursor-pointer group"
                 >
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-primary italic transition-all group-hover:border-primary/50 group-hover:scale-110">
                            {p.name[0]}
                          </div>
                          <div>
                             <p className="text-base font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors italic leading-none mb-1">{p.name}</p>
                             <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{p.category}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-8 text-center text-sm font-bold text-slate-300 italic">${p.totalBudget.toFixed(1)}M</td>
                    <td className="px-6 py-8 text-center text-sm font-bold text-white italic">${p.committed.toFixed(1)}M</td>
                    <td className="px-6 py-8 text-center text-sm font-bold text-emerald-400 italic">${p.inExecution.toFixed(1)}M</td>
                    <td className="px-6 py-8 text-center text-sm font-bold text-indigo-400 italic">${p.delivered.toFixed(1)}M</td>
                    <td className="px-6 py-8 text-center text-sm font-bold text-slate-500 italic">${(p.totalBudget - p.committed).toFixed(1)}M</td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-4">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest ${
                          p.status === 'NOMINAL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          p.status === 'AT_RISK' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          'bg-red-500/10 text-red-500 border-red-500/30'
                        }`}>
                            {p.status.replace('_', ' ')}
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

// --- SUB-COMPONENT: PROGRAM DRILLDOWN ---
const ProgramDrilldown: React.FC<{ program: ProgramFinance, onBack: () => void }> = ({ program, onBack }) => {
  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col gap-6 px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio Overview
        </button>

        <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
           <div className="relative z-10 flex items-center gap-12">
              <div className="p-12 bg-slate-950/60 rounded-[48px] border border-slate-800 shadow-2xl relative group">
                 <Briefcase className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
                 <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center animate-pulse shadow-xl ${
                   program.status === 'NOMINAL' ? 'bg-emerald-500' : 'bg-red-500'
                 }`}>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                 </div>
              </div>
              <div>
                 <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">Active Program Control</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{program.category}</span>
                 </div>
                 <h3 className="text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{program.name}</h3>
                 <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                    <span className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Authority: USSF Atlas Node</span>
                    <span className={`flex items-center gap-2 ${program.status === 'NOMINAL' ? 'text-emerald-400' : 'text-red-400'}`}>
                      <TrendingUp className="w-4 h-4" /> Variance: {program.scheduleVariance > 0 ? `+${program.scheduleVariance}d` : `${program.scheduleVariance}d`}
                    </span>
                 </div>
              </div>
           </div>
           <div className="relative z-10 text-right lg:border-l lg:border-slate-800 lg:pl-12 h-full flex flex-col justify-center">
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest block mb-3 italic">Total Program Value</span>
              <p className="text-5xl font-black tracking-tighter italic text-white">${program.totalBudget.toFixed(1)}M</p>
              <div className="mt-4 flex items-center justify-end gap-2 text-primary font-black text-xs uppercase italic tracking-widest">
                 Committed: {Math.round((program.committed / program.totalBudget) * 100)}%
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
         <div className="lg:col-span-2 space-y-8">
            {/* Cost S-Curve */}
            <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
               <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary" /> Cost S-Curve Performance
               </h4>
               <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={program.scurve}>
                      <defs>
                        <linearGradient id="drillPlanned" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="week" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}M`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      />
                      <Area type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} fill="url(#drillPlanned)" />
                      <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex gap-8 mt-6 px-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase italic">
                     <div className="w-3 h-3 bg-blue-500 rounded" /> Planned Commitment
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase italic">
                     <div className="w-3 h-3 bg-emerald-500 rounded" /> Actual Commitment
                  </div>
               </div>
            </section>

            {/* Milestones */}
            <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
               <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" /> Delivery Milestones
               </h4>
               <div className="space-y-6">
                  {program.milestones.map((m, idx) => (
                    <div key={idx} className="p-8 bg-slate-800/40 border border-slate-800 rounded-[32px] flex justify-between items-center group transition-all hover:border-primary/20">
                        <div className="flex items-center gap-6">
                           <div className={`p-4 rounded-2xl border ${
                             m.status === 'DONE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                             m.status === 'DELAYED' ? 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse' :
                             'bg-slate-900 border-slate-700 text-slate-500'
                           }`}>
                              {m.status === 'DONE' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                           </div>
                           <div>
                              <p className="text-lg font-bold text-white uppercase italic tracking-tighter leading-none">{m.label}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest italic">{m.status}</p>
                           </div>
                        </div>
                        <div className="text-right flex items-center gap-10">
                           <div className="space-y-1">
                              <span className="text-[8px] font-black text-slate-600 uppercase block italic">Planned</span>
                              <p className="text-sm font-bold text-slate-400 italic">{m.planned}</p>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[8px] font-black text-slate-600 uppercase block italic">Forecast</span>
                              <p className={`text-sm font-bold italic ${m.planned !== m.expected ? 'text-amber-400' : 'text-white'}`}>{m.expected}</p>
                           </div>
                           <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-primary transition-all" />
                        </div>
                    </div>
                  ))}
               </div>
            </section>
         </div>

         <div className="space-y-8">
            <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
               {/* Fix: Sparkles icon is now correctly imported and used */}
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles className="w-24 h-24 text-primary" /></div>
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 italic border-b border-slate-800 pb-6 flex items-center gap-3">
                  {/* Fix: Sparkles icon is now correctly imported and used */}
                  <Sparkles className="w-4 h-4 text-primary" /> AI Financial Insight
               </h4>
               <div className="space-y-8">
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-4 shadow-inner">
                     <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                       {program.status === 'NOMINAL' && `"Program is performing to budget baseline. $22.4M delivered against a target of $25M for Q4. Commitment variance is -2%."`}
                       {program.status === 'AT_RISK' && `"Schedule variance of +14d is driving overhead inflation. Commitment to execution transition is lagging. Critical path recovery required."`}
                       {program.status === 'CRITICAL' && `"Major program disruption detected. $19.2M committed with only $4.5M delivered. 28-day schedule drift in Sensor Integration Node."`}
                     </p>
                  </div>
                  <div className="space-y-4 pt-4">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-2 mb-4">Capital Yield Assessment</p>
                     <div className="flex justify-between items-center text-xs font-bold uppercase italic">
                        <span className="text-slate-500">Capital Efficiency</span>
                        <span className="text-emerald-400">92.4%</span>
                     </div>
                     <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
                     </div>
                  </div>
               </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark" />
               <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 italic">Audit Baseline</h4>
               <div className="space-y-6">
                  <div className="flex items-center gap-4 text-slate-600">
                     <ShieldCheck className="w-5 h-5 text-emerald-400" />
                     <p className="text-[10px] font-bold uppercase tracking-widest italic leading-relaxed">Program capital flow is audit-verified via Launchbelt L5 Protocol.</p>
                  </div>
                  <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-2xl text-[10px] uppercase tracking-widest border border-slate-700 transition-all flex items-center justify-center gap-3 shadow-inner">
                     <FileText className="w-4 h-4" /> Export Ledger Artifact
                  </button>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
};

export default CostSchedule;
