
import React from 'react';
import { 
  Hammer, 
  Zap, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  ChevronRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Package
} from 'lucide-react';

interface ForgeDashboardProps {
  onNavigate: (view: string, params?: any) => void;
}

const ForgeDashboard: React.FC<ForgeDashboardProps> = ({ onNavigate }) => {
  const metrics = [
    { label: 'Active Work Orders', val: '06', desc: 'In production queue', icon: Hammer, color: 'text-white', action: () => onNavigate('Work Orders') },
    { label: 'WIP In Process', val: '24', desc: 'Active units on floor', icon: Zap, color: 'text-primary', action: () => onNavigate('WIP and Routing') },
    { label: 'Integration Gates Blocked', val: '02', desc: 'Awaiting inbound parts', icon: Package, color: 'text-red-500', action: () => onNavigate('Integration and Test') },
    { label: 'Cert Holds', val: '03', desc: 'Blocked quality gates', icon: ShieldCheck, color: 'text-amber-500', action: () => onNavigate('Quality and Certifications', { subView: 'HOLDS' }) },
    { label: 'Shipments Due (7d)', val: '04', desc: 'Final manifest delivery', icon: Truck, color: 'text-emerald-400', action: () => onNavigate('Shipping and Release') },
  ];

  const actions = [
    { label: 'Approve Final Dimensional Gate', ref: 'SN-001 / WP-7721', type: 'Quality and Certifications', params: { certId: 'C1', viewMode: 'EXECUTION' }, severity: 'CRITICAL' },
    { label: 'Accept Inbound Actuators', ref: 'SHIP-1002 from Pacific North', type: 'Inbound Supplier Work', params: { view: 'DETAIL', shipId: 'SHIP-1002' }, severity: 'HIGH' },
    { label: 'Resolve Material Shortage', ref: 'WO-8804 Strut Support', type: 'Work Orders', params: { view: 'DETAIL', woId: 'WO-8804' }, severity: 'HIGH' },
    { label: 'Release Integration Kit A', ref: 'WP-7721 Final Assy', type: 'Shipping and Release', params: {}, severity: 'MED' },
    { label: 'Audit NDI Lab Calibration', ref: 'Facility Node Alpha', type: 'WIP and Routing', params: {}, severity: 'MED' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">Forge-Owned</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Forge Operational Brief</h1>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-[0.3em]">Asgard Forge - Central • Node Status: NOMINAL • SYNC: 1.2s</p>
        </div>
        <div className="hidden lg:flex items-center gap-4">
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
             <Clock className="w-3.5 h-3.5 text-primary" /> SHIFT 01: 04:32 REMAINING
           </div>
        </div>
      </div>

      {/* Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-2">
        {metrics.map((m) => (
          <button 
            key={m.label} 
            onClick={m.action}
            className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] shadow-2xl relative overflow-hidden group hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <m.icon className="w-12 h-12 text-primary" />
            </div>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{m.label}</p>
            <p className={`text-4xl font-bold ${m.color} tracking-tighter mb-2`}>{m.val}</p>
            <p className="text-[8px] text-slate-600 font-bold uppercase">{m.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
         {/* AI Forge Brief */}
         <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Sparkles className="w-48 h-48 text-primary" />
            </div>
            <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6 relative z-10">
               <h2 className="text-xl font-bold text-white uppercase italic tracking-tight flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                  AI Forge Brief
               </h2>
               <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] font-black rounded-lg uppercase">Capacity: BALANCED</span>
            </div>
            <div className="space-y-6 relative z-10">
               <div className="flex gap-4">
                  <div className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  <p className="text-sm text-slate-300 font-medium leading-relaxed italic"><span className="text-white font-bold">Material Criticality:</span> WP-8802 Strut Support is blocked due to inbound alloy delay (Shipment SHIP-0994).</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-1 h-1 rounded-full bg-amber-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <p className="text-sm text-slate-300 font-medium leading-relaxed italic"><span className="text-white font-bold">Throughput Alert:</span> CNC Station Alpha utilization is at <span className="text-primary font-bold">92%</span>. Recommend rescheduling non-critical maintenance.</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <p className="text-sm text-slate-300 font-medium leading-relaxed italic"><span className="text-white font-bold">Quality Milestone:</span> 08 Integration Kits verified and ready for manifest release.</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_8px_rgba(var(--primary-color-rgb),0.8)]" />
                  <p className="text-sm text-slate-300 font-medium leading-relaxed italic"><span className="text-white font-bold">Resource Op:</span> Shift 2 crew has high proficiency rating (98%) for current composite layup tasks.</p>
               </div>
            </div>
         </div>

         {/* High Priority Actions */}
         <div className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
               <h2 className="text-xl font-bold text-white uppercase italic tracking-tight flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  High Priority Actions
               </h2>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Action Queue</span>
            </div>
            <div className="divide-y divide-slate-800 overflow-y-auto custom-scrollbar flex-1 max-h-[440px]">
               {actions.map((act, idx) => (
                 <button 
                   key={idx} 
                   onClick={() => onNavigate(act.type, act.params)}
                   className="w-full p-6 hover:bg-slate-800/30 transition-all flex items-center justify-between group text-left"
                 >
                    <div className="flex items-center gap-6">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                          act.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                          act.severity === 'HIGH' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                          'bg-primary/10 border-primary/30 text-primary'
                       }`}>
                          <Zap className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors mb-1">{act.label}</p>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{act.ref}</p>
                       </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                 </button>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ForgeDashboard;
