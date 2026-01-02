
import React, { useState } from 'react';
import { 
  Layers, Activity, ShieldCheck, Box, ChevronRight, 
  ArrowLeft, Clock, Zap, Target, Hammer, AlertTriangle,
  FlaskConical, CheckCircle2, History, Package, ClipboardList
} from 'lucide-react';

interface IntegrationTestProps {
  initialView?: 'LIST' | 'EXECUTION';
  initialWoId?: string;
  onNavigate: (view: string, params?: any) => void;
  onBack: () => void;
}

const MOCK_INTEGRATION = [
  { id: 'INT-9011-A', program: 'NightOwl-V4', assembly: 'Avionics System Kit', ready: true, blockers: 0, currentGate: 'Thermal Fit', testStatus: 'PENDING', finish: 'Nov 18' },
  { id: 'INT-7721-B', program: 'Falcon-Heavy-V2', assembly: 'Thrust Vector Hub', ready: false, blockers: 2, currentGate: 'Mechanical Pre-Assy', testStatus: 'NOT_STARTED', finish: 'Nov 22' },
  { id: 'INT-8802-C', program: 'Starship-Cargo', assembly: 'Composite Frame S-1', ready: true, blockers: 0, currentGate: 'Final System Test', testStatus: 'IN_PROGRESS', finish: 'Today' },
];

const IntegrationTest: React.FC<IntegrationTestProps> = ({ initialView = 'LIST', initialWoId, onNavigate, onBack }) => {
  const [view, setView] = useState<'LIST' | 'EXECUTION'>(initialView);
  const [selectedIntId, setSelectedIntId] = useState<string | null>(initialWoId || null);

  const selectedInt = MOCK_INTEGRATION.find(i => i.id === selectedIntId);

  if (view === 'EXECUTION' && selectedInt) {
    return <IntegrationExecution intId={selectedInt.id} onBack={() => { setView('LIST'); onBack(); }} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="px-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">Mixed</span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Integration & Test Center</h2>
        <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Multi-Node Component Aggregation & System Proof</p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-2">
        {MOCK_INTEGRATION.map(i => (
          <div 
            key={i.id} 
            onClick={() => { setSelectedIntId(i.id); setView('EXECUTION'); }}
            className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center justify-between group hover:border-primary/50 transition-all cursor-pointer"
          >
             <div className="flex items-center gap-10">
                <div className={`p-8 rounded-[32px] border transition-all ${i.ready ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400 shadow-xl'}`}>
                   <Layers className="w-8 h-8" />
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{i.program}</span>
                      <span className="mono text-[10px] text-primary font-black uppercase tracking-tighter">{i.id}</span>
                   </div>
                   <h3 className="text-2xl font-bold text-white uppercase italic group-hover:text-primary transition-colors leading-none mb-3">{i.assembly}</h3>
                   <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Gate: {i.currentGate}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Target: {i.finish}</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-12 mt-6 md:mt-0">
                <div className="text-center">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Integration Ready</p>
                   {i.ready ? (
                     <span className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> READY</span>
                   ) : (
                     <span className="text-red-500 font-bold text-xs flex items-center justify-center gap-1.5"><AlertTriangle className="w-4 h-4" /> {i.blockers} BLOCKERS</span>
                   )}
                </div>
                <div className="text-center">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Test Status</p>
                   <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${
                      i.testStatus === 'IN_PROGRESS' ? 'bg-primary/10 text-primary border-primary/20 animate-pulse' : 'bg-slate-800 text-slate-500 border-slate-700'
                   }`}>{i.testStatus.replace('_', ' ')}</span>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IntegrationExecution: React.FC<{ intId: string, onBack: () => void }> = ({ intId, onBack }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
       <div className="flex flex-col gap-6 px-2">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Center List
          </button>

          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex items-center gap-12">
                <div className="p-12 bg-primary/10 rounded-[48px] border border-primary/20 shadow-2xl relative group">
                   <Layers className="w-16 h-16 text-primary group-hover:rotate-12 transition-all duration-700" />
                </div>
                <div>
                   <span className="mono text-[11px] text-primary font-black uppercase tracking-widest block mb-2">Integration ID: {intId}</span>
                   <h2 className="text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">Execution Protocol</h2>
                   <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Ready for Assembly</span>
                      <span className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-primary" /> System Test Queued</span>
                   </div>
                </div>
             </div>
             <div className="relative z-10">
                <button className="px-12 py-6 bg-primary hover:bg-primary-dark text-white font-black rounded-[32px] uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30 transition-all active:scale-95">Complete Assembly Step</button>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
          <div className="space-y-8">
             <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
                <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3">
                   <Package className="w-6 h-6 text-primary" />
                   Dependency Readiness
                </h4>
                <div className="space-y-4">
                   {[
                     { part: 'Chassis Main Block', from: 'Forge Internal', status: 'STAGED' },
                     { part: 'Actuator Kit (04 Units)', from: 'Pacific North Precision', status: 'STAGED' },
                     { part: 'Wiring Harness (Alpha)', from: 'Forge Internal', status: 'IN_PREP' },
                     { part: 'Composite Shield Panels', from: 'Silicon Valley Forge', status: 'IN_TRANSIT' },
                   ].map((d, i) => (
                     <div key={i} className="p-6 bg-slate-800/40 rounded-3xl border border-slate-800 flex justify-between items-center">
                        <div>
                           <p className="text-sm font-bold text-white uppercase">{d.part}</p>
                           <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic mt-1">{d.from}</p>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${
                           d.status === 'STAGED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}>{d.status}</span>
                     </div>
                   ))}
                </div>
             </section>
          </div>
          <div className="space-y-8">
             <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><Target className="w-48 h-48 text-primary" /></div>
                <h4 className="text-xl font-bold text-white mb-10 uppercase italic tracking-tighter border-b border-slate-800 pb-6 flex items-center gap-3 relative z-10">
                   <Zap className="w-6 h-6 text-primary" />
                   Assembly Gate Sequence
                </h4>
                <div className="space-y-10 pl-10 relative z-10">
                   <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-800" />
                   {[
                     { step: 'Mechanical Seating', status: 'COMPLETE', user: 'D. Miller' },
                     { step: 'Avionics Interconnect', status: 'ACTIVE', user: 'K. Vance' },
                     { step: 'Thermal Shield Layup', status: 'PENDING', user: 'A. Chen' },
                     { step: 'Full System Diagnostic', status: 'PENDING', user: 'S. Connor' },
                   ].map((s, idx) => (
                     <div key={idx} className="relative group">
                        <div className={`absolute -left-[30px] top-0 w-5 h-5 rounded-full border-4 transition-all ${
                          s.status === 'COMPLETE' ? 'bg-emerald-500 border-emerald-400 shadow-xl' : 
                          s.status === 'ACTIVE' ? 'bg-primary border-primary ring-8 ring-primary/10 animate-pulse' :
                          'bg-slate-950 border-slate-800'
                        }`} />
                        <div>
                           <p className="text-lg font-bold uppercase tracking-tight text-white leading-none mb-1">{s.step}</p>
                           <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic">{s.status} • Assigned: {s.user}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>
       </div>
    </div>
  );
};

export default IntegrationTest;
