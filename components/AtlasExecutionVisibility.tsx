import React, { useState, useMemo } from 'react';
import { 
  Target, Shield, Box, Zap, ChevronRight, ArrowLeft, 
  CheckCircle2, Clock, MapPin, Sparkles, Database, 
  Activity, Target as Crosshair, TrendingUp, AlertTriangle, 
  Layers, Hammer, ShieldAlert, BarChart3, Fingerprint, 
  History, Info, Globe, Server, Truck, UserCheck, Timer,
  // Fix: Added missing ShieldCheck import
  ShieldCheck
} from 'lucide-react';

interface ExecutionProgram {
  id: string;
  mission: string;
  supplier: string;
  system: string;
  phase: 'Design' | 'Build' | 'Test' | 'Integration' | 'Shipping';
  location: string;
  progress: number;
  deliveryDate: string;
  originalDeliveryDate: string;
  confidence: 'HIGH' | 'DEGRADING' | 'CRITICAL';
  riskDescription?: string;
  nodes: { name: string; activity: string; status: 'NOMINAL' | 'DELAYED' }[];
  issues: { label: string; impact: string; severity: 'HIGH' | 'MED' }[];
}

const MOCK_ACTIVE_EXECUTIONS: ExecutionProgram[] = [
  { 
    id: 'EXEC-USSF-4002', 
    mission: 'Project SkyWatch', 
    supplier: 'Orbital Dynamics', 
    system: 'Tactical ISR Microsat', 
    phase: 'Integration', 
    location: 'Forge Austin Node',
    progress: 78,
    deliveryDate: 'Jan 12, 2024', 
    originalDeliveryDate: 'Jan 05, 2024',
    confidence: 'HIGH',
    nodes: [
      { name: 'Forge Austin', activity: 'Final System Integration', status: 'NOMINAL' },
      { name: 'Apex Machining', activity: 'Component Fab Complete', status: 'NOMINAL' },
      { name: 'Great Lakes', activity: 'Thermal Coating Applied', status: 'NOMINAL' }
    ],
    issues: [
      { label: 'Minor Lead-time Drift', impact: '+7 Days to Final Release', severity: 'MED' }
    ]
  },
  { 
    id: 'EXEC-USSF-3991', 
    mission: 'Responsive PNT Array', 
    supplier: 'Astra-Geo Navigation', 
    system: 'PNT Service Node', 
    // Fix: Changed 'Testing' to 'Test' to match phase type definition
    phase: 'Test', 
    location: 'Pacific North Hub',
    progress: 92,
    deliveryDate: 'Dec 15, 2023', 
    originalDeliveryDate: 'Dec 15, 2023',
    confidence: 'HIGH',
    nodes: [
      { name: 'Forge Austin', activity: 'Assembly Staging', status: 'NOMINAL' },
      { name: 'Pacific North', activity: 'Electronic Component QA', status: 'NOMINAL' }
    ],
    issues: []
  },
  { 
    id: 'EXEC-USSF-5112', 
    mission: 'Lunar Relay Alpha', 
    supplier: 'Vertex Systems', 
    system: 'MEO Comms Relay', 
    phase: 'Build', 
    location: 'Forge Boulder Node',
    progress: 42,
    deliveryDate: 'Mar 20, 2024', 
    originalDeliveryDate: 'Feb 15, 2024',
    confidence: 'DEGRADING',
    riskDescription: 'Critical path bottleneck detected at component level.',
    nodes: [
      { name: 'Forge Boulder', activity: 'Structural Assembly', status: 'NOMINAL' },
      { name: 'Redstone Prop.', activity: 'Thruster Manifold Delay', status: 'DELAYED' }
    ],
    issues: [
      { label: 'Propulsion Lead-time', impact: '+35 Days Schedule Drift', severity: 'HIGH' },
      { label: 'Node Capacity', impact: 'Sub-tier backlog in SE Region', severity: 'MED' }
    ]
  },
];

// Fix: Added missing AtlasExecutionVisibilityProps interface definition
interface AtlasExecutionVisibilityProps {
  onNavigate: (view: string, params?: any) => void;
  onBack: () => void;
}

const AtlasExecutionVisibility: React.FC<AtlasExecutionVisibilityProps> = ({ onNavigate, onBack }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedExecution = useMemo(() => MOCK_ACTIVE_EXECUTIONS.find(p => p.id === selectedId), [selectedId]);

  const summaryStats = useMemo(() => ({
    activeCount: MOCK_ACTIVE_EXECUTIONS.length,
    nominalCount: MOCK_ACTIVE_EXECUTIONS.filter(e => e.confidence === 'HIGH').length,
    criticalCount: MOCK_ACTIVE_EXECUTIONS.filter(e => e.confidence === 'CRITICAL' || e.confidence === 'DEGRADING').length,
    upcomingDeliveries: 2
  }), []);

  if (selectedExecution) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 px-2 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pr-4">
         <div className="flex flex-col gap-6">
            <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Execution Briefing
            </button>

            <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
               <div className="relative z-10 flex items-center gap-10">
                  <div className={`p-10 rounded-[40px] border shadow-2xl ${selectedExecution.confidence !== 'HIGH' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-primary/10 border-primary/30'}`}>
                     <Activity className={`w-16 h-16 ${selectedExecution.confidence !== 'HIGH' ? 'text-amber-400' : 'text-primary'}`} />
                  </div>
                  <div>
                     <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">Active Execution Node</span>
                        <span className="mono text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{selectedExecution.id}</span>
                     </div>
                     <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{selectedExecution.mission}</h2>
                     <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                        <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Supplier: {selectedExecution.supplier}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Lead Facility: {selectedExecution.location}</span>
                     </div>
                  </div>
               </div>
               <div className="relative z-10 text-right lg:border-l lg:border-slate-800 lg:pl-12 h-full flex flex-col justify-center">
                  <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest block mb-3 italic">Projected Delivery</span>
                  <p className={`text-5xl font-black tracking-tighter italic ${selectedExecution.confidence === 'HIGH' ? 'text-white' : 'text-amber-400'}`}>{selectedExecution.deliveryDate}</p>
                  <div className={`mt-4 flex items-center justify-end gap-2 font-black text-xs uppercase italic tracking-widest ${selectedExecution.confidence === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'}`}>
                     <ShieldCheck className="w-4 h-4" /> Confidence: {selectedExecution.confidence}
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
            <div className="lg:col-span-2 space-y-8">
               {/* EXECUTION TIMELINE */}
               <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                  <h3 className="text-xl font-bold text-white mb-10 border-b border-slate-800 pb-6 uppercase italic tracking-tighter flex items-center gap-3">
                     <Layers className="w-6 h-6 text-primary" /> System Lifecycle Pipeline
                  </h3>
                  <div className="flex justify-between items-center px-10 relative">
                     <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0" />
                     {['Design', 'Build', 'Test', 'Integration', 'Shipping'].map((phase, idx) => {
                       const phaseList = ['Design', 'Build', 'Test', 'Integration', 'Shipping'];
                       const currentIdx = phaseList.indexOf(selectedExecution.phase);
                       const isActive = phase === selectedExecution.phase;
                       const isComplete = phaseList.indexOf(phase as any) < currentIdx;
                       
                       return (
                         <div key={phase} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${
                              isActive ? 'bg-primary border-primary ring-8 ring-primary/10 animate-pulse' : 
                              isComplete ? 'bg-emerald-500 border-emerald-400' : 
                              'bg-slate-900 border-slate-800'
                            }`}>
                               {isComplete && <CheckCircle2 className="w-6 h-6 text-white" />}
                               {isActive && <Activity className="w-5 h-5 text-white" />}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest italic ${isActive ? 'text-white' : 'text-slate-600'}`}>{phase}</span>
                         </div>
                       );
                     })}
                  </div>
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-8 bg-slate-950/60 rounded-[32px] border border-slate-800 border-dashed relative">
                        <div className="flex justify-between items-start mb-6">
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic leading-none">Original Expectation</h4>
                        </div>
                        <p className="text-xl font-bold text-slate-500 italic tracking-tight">{selectedExecution.originalDeliveryDate}</p>
                        <p className="text-[9px] text-slate-700 font-bold uppercase mt-2">Baseline Release Date</p>
                     </div>
                     <div className="p-8 bg-primary/5 rounded-[32px] border border-primary/20 relative">
                        <div className="flex justify-between items-start mb-6">
                           <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic leading-none">Current Forecast</h4>
                        </div>
                        <p className="text-xl font-bold text-white italic tracking-tight">{selectedExecution.deliveryDate}</p>
                        <p className={`text-[9px] font-bold uppercase mt-2 ${selectedExecution.deliveryDate === selectedExecution.originalDeliveryDate ? 'text-emerald-500' : 'text-amber-500'}`}>
                           {selectedExecution.deliveryDate === selectedExecution.originalDeliveryDate ? 'ON NOMINAL SCHEDULE' : 'SCHEDULE ADJUSTED'}
                        </p>
                     </div>
                  </div>
               </section>

               {/* MANUFACTURING STATUS */}
               <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-10 border-b border-slate-800 pb-6 uppercase italic tracking-tighter flex items-center gap-3">
                     <Hammer className="w-6 h-6 text-primary" /> Node Fabrication Status
                  </h3>
                  <div className="space-y-6">
                     {selectedExecution.nodes.map((node, i) => (
                       <div key={i} className="flex justify-between items-center p-8 bg-slate-800/30 border border-slate-800 rounded-[32px] group hover:border-slate-600 transition-all">
                          <div className="flex items-center gap-6">
                             <div className={`p-4 rounded-2xl ${node.status === 'NOMINAL' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border border-current/20`}>
                                <Server className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-lg font-bold text-white uppercase tracking-tight italic leading-none">{node.name}</p>
                                <p className="text-[10px] text-slate-500 font-black uppercase mt-1 italic">{node.activity}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase italic tracking-widest ${
                               node.status === 'NOMINAL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse'
                             }`}>{node.status}</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </section>
            </div>

            {/* RISKS AND IMPACTS */}
            <div className="space-y-8">
               <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldAlert className="w-24 h-24 text-red-500" /></div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 italic border-b border-slate-800 pb-6 flex items-center gap-3">
                     <AlertTriangle className="w-5 h-5 text-amber-500" /> Execution Risks
                  </h4>
                  <div className="space-y-6">
                     {selectedExecution.issues.length > 0 ? (
                       selectedExecution.issues.map((issue, i) => (
                        <div key={i} className={`p-6 rounded-3xl space-y-4 border ${issue.severity === 'HIGH' ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                           <div className="flex justify-between items-center">
                              <p className={`text-xs font-black uppercase tracking-tighter ${issue.severity === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`}>{issue.label}</p>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${issue.severity === 'HIGH' ? 'bg-red-500/20 border-red-500/30' : 'bg-amber-500/20 border-amber-500/30'}`}>{issue.severity}</span>
                           </div>
                           <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic">Impact: {issue.impact}</p>
                        </div>
                       ))
                     ) : (
                       <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl text-center">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">No Critical Risks Detected</p>
                       </div>
                     )}
                  </div>
               </section>

               <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><BarChart3 className="w-24 h-24 text-primary" /></div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 italic border-b border-slate-800 pb-6">Completion Progress</h4>
                  <div className="space-y-8">
                     <div className="text-center">
                        <p className="text-6xl font-black text-white italic tracking-tighter leading-none mb-2">{selectedExecution.progress}%</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Phase: {selectedExecution.phase}</p>
                     </div>
                     <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.7)]" style={{ width: `${selectedExecution.progress}%` }} />
                     </div>
                     <div className="flex items-center gap-4 pt-4 text-slate-600 border-t border-slate-800">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <p className="text-[9px] font-bold uppercase tracking-widest">Quality Verified via L5 Protocol</p>
                     </div>
                  </div>
               </section>

               <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 italic border-b border-slate-800 pb-6">Authority Registry</h4>
                  <div className="space-y-6">
                     <div className="flex items-center gap-6">
                        <Fingerprint className="w-6 h-6 text-slate-700" />
                        <div>
                           <p className="text-[10px] font-black text-white uppercase italic">Ledger Sealed</p>
                           <p className="text-[8px] text-slate-600 font-bold uppercase mt-1 italic tracking-tighter">HASH: USSF-EXEC-{(Math.random()*1000).toFixed(0)}-L5</p>
                        </div>
                     </div>
                     <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-2xl text-[10px] uppercase tracking-widest border border-slate-700 transition-all flex items-center justify-center gap-3">
                        <History className="w-4 h-4" /> View Operational Provenance
                     </button>
                  </div>
               </section>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 px-2 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pr-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic">Execution Briefing</h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.3em]">Direct Manufacturing Telemetry • Decision-Grade Transparency</p>
        </div>
        <div className="flex gap-4">
           <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl text-center px-8 shadow-xl">
              <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest block mb-1">Upcoming Final Deliveries</span>
              <p className="text-2xl font-black text-white italic leading-none">{summaryStats.upcomingDeliveries}</p>
           </div>
        </div>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Activity className="w-20 h-20 text-primary" /></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic mb-2">Programs In Flight</p>
            <p className="text-6xl font-bold text-white tracking-tighter leading-none mb-2">{summaryStats.activeCount}</p>
            <p className="text-[9px] text-slate-600 font-bold uppercase">Manufacturing Node Orchestration Active</p>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-20 h-20 text-emerald-400" /></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic mb-2">Nominal Confidence</p>
            <p className="text-6xl font-bold text-emerald-400 tracking-tighter leading-none mb-2">{summaryStats.nominalCount}</p>
            <p className="text-[9px] text-slate-600 font-bold uppercase">Executing within schedule baseline</p>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><AlertTriangle className="w-20 h-20 text-red-500" /></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic mb-2">Active Disruptions</p>
            <p className="text-6xl font-bold text-red-400 tracking-tighter leading-none mb-2">{summaryStats.criticalCount}</p>
            <p className="text-[9px] text-slate-600 font-bold uppercase">Requires Acquisition Oversight</p>
         </div>
      </div>

      <div className="space-y-6">
         <div className="flex items-center gap-3 px-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Active Execution Stream</h3>
         </div>
         <div className="grid grid-cols-1 gap-6">
            {MOCK_ACTIVE_EXECUTIONS.map(exec => (
              <button 
                key={exec.id} 
                onClick={() => setSelectedId(exec.id)}
                className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] text-left hover:border-primary/50 transition-all group shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12"
              >
                 <div className={`absolute top-0 left-0 w-1.5 h-full transition-opacity ${
                    exec.confidence === 'HIGH' ? 'bg-emerald-500' : exec.confidence === 'DEGRADING' ? 'bg-amber-500' : 'bg-red-500'
                 }`} />
                 
                 <div className="flex items-center gap-10 flex-1">
                    <div className={`p-8 rounded-[32px] border transition-all ${
                       exec.confidence !== 'HIGH' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-primary/10 border-primary/20 text-primary shadow-xl'
                    }`}>
                       <Box className="w-8 h-8" />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{exec.id}</span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${
                             exec.confidence === 'HIGH' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                          }`}>Confidence: {exec.confidence}</span>
                       </div>
                       <h3 className="text-3xl font-bold text-white uppercase italic tracking-tighter leading-none mb-3 group-hover:text-primary transition-colors">{exec.mission}</h3>
                       <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {exec.location}</span>
                          <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-primary" /> {exec.supplier}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-16 flex-1 lg:border-l lg:border-slate-800 lg:pl-16 w-full lg:w-auto">
                    <div className="flex-1 space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase italic tracking-widest">
                          <span className="text-slate-600">PHASE: {exec.phase}</span>
                          <span className="text-white">{exec.progress}%</span>
                       </div>
                       <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${exec.confidence === 'HIGH' ? 'bg-primary' : 'bg-amber-500'}`} style={{ width: `${exec.progress}%` }} />
                       </div>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1 italic">Projected Delivery</p>
                       <p className={`text-xl font-bold italic tracking-tighter ${exec.deliveryDate !== exec.originalDeliveryDate ? 'text-amber-400' : 'text-white'}`}>{exec.deliveryDate}</p>
                    </div>
                    <ChevronRight className="w-8 h-8 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                 </div>
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AtlasExecutionVisibility;