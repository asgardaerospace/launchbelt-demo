
import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, ArrowLeft, ChevronRight, CheckCircle2, 
  ShieldCheck, Zap, DollarSign, Target, MapPin, 
  Clock, Rocket, Activity, Package, History, 
  FileText, ClipboardList, TrendingUp, Info, 
  ArrowUpRight, Users, ShieldAlert, Sparkles, AlertTriangle, Check
} from 'lucide-react';
import { logAction } from '../services/auditService';

interface AtlasRFQsProps {
  onNavigate: (view: string, params?: any) => void;
  onBack: () => void;
  initialSolution?: any;
}

const MOCK_RFQS = [
  { 
    id: 'RFP-LB-4002', 
    mission: 'Project SkyWatch', 
    type: 'RFP',
    status: 'In Sourcing', 
    issueDate: 'Nov 12, 2023',
    deadline: 'Dec 05, 2023',
    priorities: ['System Persistence', 'Optical Resolution', 'NIST Compliance'],
    suppliers: [
      { name: 'Orbital Dynamics', system: 'Tactical ISR Microsat', status: 'Submitted', quote: '$14.2M', delivery: '90 Days', alignment: '98%', risk: 'LOW' },
      { name: 'NovaSpace Systems', system: 'Vanguard Strategic GEO', status: 'In Progress', quote: '--', delivery: '--', alignment: '85%', risk: 'MED' },
      { name: 'SpaceLink Corp', system: 'Orion-X Bus', status: 'Not Started', quote: '--', delivery: '--', alignment: '--', risk: '--' }
    ]
  },
  { 
    id: 'RFQ-LB-4112', 
    mission: 'Lunar Relay Phase 1', 
    type: 'RFQ',
    status: 'Evaluated', 
    issueDate: 'Nov 10, 2023',
    deadline: 'Nov 20, 2023',
    priorities: ['Bandwidth Threshold', 'Schedule Certainty'],
    suppliers: [
      { name: 'Vertex Systems', system: 'Persistent Communications Hub', status: 'Submitted', quote: '$48M', delivery: '180 Days', alignment: '92%', risk: 'MED' }
    ]
  },
  { 
    id: 'RFQ-LB-3991', 
    mission: 'Responsive PNT Array', 
    type: 'RFQ',
    status: 'Awarded', 
    issueDate: 'Oct 28, 2023',
    deadline: 'Nov 15, 2023',
    priorities: ['Form Factor', 'Supplied PNT Service'],
    suppliers: [
      { name: 'Astra-Geo Navigation', system: 'Responsive PNT Array', status: 'Submitted', quote: '$9.5M', delivery: '60 Days', alignment: '95%', risk: 'LOW' }
    ]
  },
];

const AtlasRFQs: React.FC<AtlasRFQsProps> = ({ onNavigate, onBack, initialSolution }) => {
  const [activeRfqId, setActiveRfqId] = useState<string | null>(null);
  const [step, setStep] = useState(initialSolution ? 1 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const selectedRfq = useMemo(() => MOCK_RFQS.find(r => r.id === activeRfqId), [activeRfqId]);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const newId = 'RFQ-LB-' + Math.floor(1000 + Math.random() * 9000);
    await logAction('SF-USER-09', 'RFP_ISSUED', newId, `Space Force acquisition request initiated for ${initialSolution.name} with ${initialSolution.supplier}.`);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedId(newId);
      setStep(4);
    }, 2000);
  };

  if (step > 0 && initialSolution) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in duration-500 pb-20">
         <div className="flex items-center justify-between">
            <button onClick={() => setStep(0)} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Cancel Request
            </button>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-8 h-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-slate-800'}`} />
              ))}
            </div>
         </div>

         {step === 1 && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
              <div className="text-center space-y-4">
                 <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic leading-none">Initialize Acquisition Request</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Sourcing: {initialSolution.supplier}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl space-y-10">
                 <div className="flex items-center gap-10">
                    <div className="p-8 bg-primary/10 rounded-[32px] border border-primary/20 text-primary">
                       <Rocket className="w-12 h-12" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-bold text-white uppercase italic tracking-tighter">{initialSolution.name}</h3>
                       <p className="text-slate-500 font-bold uppercase tracking-widest mt-1">Vendor of Record: {initialSolution.supplier}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-8 border-t border-slate-800 pt-10">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Request Type</p>
                       <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white italic outline-none">
                          <option>Request for Proposal (RFP)</option>
                          <option>Request for Quote (RFQ)</option>
                       </select>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Production Backbone</p>
                       <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-xs font-bold text-emerald-400 flex items-center gap-3 shadow-inner">
                          <ShieldCheck className="w-4 h-4" /> ASGARD FORGE COMPLIANCE READY
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setStep(2)} className="w-full py-6 bg-primary hover:bg-primary-dark text-white font-black rounded-[32px] text-sm uppercase tracking-[0.2em] shadow-2xl transition-all">Next: Set Delivery & Parameters</button>
              </div>
           </div>
         )}

         {step === 2 && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
              <div className="text-center space-y-4">
                 <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic leading-none">Evaluation Parameters</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Step 2: Define Acquisition Criteria</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Required Units</label>
                       <input type="number" defaultValue={1} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xl font-black text-white outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Acquisition Priority</label>
                       <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-bold text-white outline-none italic">
                          <option>Mission Critical (L-5)</option>
                          <option>Standard Operations</option>
                          <option>R&D / Experimental</option>
                       </select>
                    </div>
                 </div>
                 <button onClick={() => setStep(3)} className="w-full py-6 bg-primary hover:bg-primary-dark text-white font-black rounded-[32px] text-sm uppercase tracking-[0.2em] shadow-2xl transition-all">Next: Final Review & Commit</button>
              </div>
           </div>
         )}

         {step === 3 && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
              <div className="text-center space-y-4">
                 <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic leading-none">Formal Commitment</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Step 3: Direct Sourcing Request Dispatch</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl space-y-12">
                 <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] italic border-b border-slate-800 pb-4">Request Manifest</h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-sm font-bold uppercase">
                          <span className="text-slate-500 italic">System Scope</span>
                          <span className="text-white">{initialSolution.name}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-bold uppercase">
                          <span className="text-slate-500 italic">Issuing Authority</span>
                          <span className="text-white">USSF ATLAS NODE</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-bold uppercase">
                          <span className="text-slate-500 italic">Est. Contract Ceiling</span>
                          <span className="text-emerald-400">{initialSolution.price}</span>
                       </div>
                    </div>
                 </div>
                 <div className="p-8 bg-primary/5 border border-primary/20 rounded-[32px] flex items-center gap-6">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                    <div>
                       <p className="text-sm font-bold text-white uppercase italic">NIST 800-171 Acquisition Protocol</p>
                       <p className="text-[10px] text-slate-500 font-black uppercase mt-1 italic">This creates a secure procurement record for {initialSolution.supplier}.</p>
                    </div>
                 </div>
                 <button 
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit} 
                  className="w-full py-8 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-[40px] text-xl uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-6"
                 >
                   {isSubmitting ? <Activity className="w-8 h-8 animate-spin" /> : `Dispatch RFP to ${initialSolution.supplier.split(' ')[0]}`}
                 </button>
              </div>
           </div>
         )}

         {step === 4 && (
            <div className="text-center space-y-12 animate-in zoom-in-95 duration-700 py-20">
               <div className="w-32 h-32 bg-emerald-500/10 border border-emerald-500/30 rounded-[48px] mx-auto flex items-center justify-center shadow-2xl">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none">RFP Dispatched</h3>
                  <p className="text-xl text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                     Acquisition Request <span className="text-primary font-black italic">{submittedId}</span> initialized. 
                     <br/>Forwarded to supplier for technical evaluation.
                  </p>
               </div>
               <div className="pt-12">
                  <button 
                    onClick={() => { setStep(0); }}
                    className="px-20 py-8 bg-white text-slate-900 font-black rounded-[40px] text-xl uppercase tracking-widest shadow-2xl transition-all"
                  >
                    Return to RFP History
                  </button>
               </div>
            </div>
         )}
      </div>
    );
  }

  if (selectedRfq) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
        <div className="flex flex-col gap-6 px-2">
          <button onClick={() => setActiveRfqId(null)} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Acquisition Ledger
          </button>

          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex items-center gap-10">
                <div className="p-8 bg-primary/10 rounded-[32px] border border-primary/20 text-primary shadow-2xl">
                   <ClipboardList className="w-12 h-12" />
                </div>
                <div>
                   <div className="flex items-center gap-4 mb-4">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${selectedRfq.type === 'RFP' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>{selectedRfq.type} baseline</span>
                      <span className="mono text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{selectedRfq.id}</span>
                   </div>
                   <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">{selectedRfq.mission}</h2>
                   <div className="flex items-center gap-6 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                      <span className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Multi-Source Request</span>
                      <span className="flex items-center gap-2 text-primary"><Clock className="w-4 h-4" /> Deadline: {selectedRfq.deadline}</span>
                   </div>
                </div>
             </div>

             <div className="relative z-10 space-y-4 lg:border-l lg:border-slate-800 lg:pl-12 flex flex-col">
                <div className="text-right">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mb-1">Acquisition Status</p>
                   <p className="text-2xl font-black text-white uppercase italic">{selectedRfq.status}</p>
                </div>
                <button className="px-12 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-[32px] uppercase tracking-[0.2em] text-xs border border-slate-700 transition-all">Download Master RFP Documents</button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl">
                 <h3 className="text-xl font-bold text-white mb-10 border-b border-slate-800 pb-6 uppercase italic tracking-tighter flex items-center gap-3">
                    <Info className="w-6 h-6 text-primary" /> Request Overview & Evaluation
                 </h3>
                 <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-2">Operational Context</p>
                          <p className="text-sm text-slate-400 leading-relaxed font-medium italic">Mission requiring rapid deployment and {selectedRfq.priorities[0].toLowerCase()} focus. Evaluating based on TRL-9 maturity and network manufacturing capability.</p>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-2">Response Timeline</p>
                          <div className="space-y-2">
                             <div className="flex justify-between text-xs font-bold uppercase italic">
                                <span className="text-slate-500">Issued</span>
                                <span className="text-white">{selectedRfq.issueDate}</span>
                             </div>
                             <div className="flex justify-between text-xs font-bold uppercase italic">
                                <span className="text-slate-500">Selection Target</span>
                                <span className="text-primary">Dec 12, 2023</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-2">Evaluation Priorities</p>
                       <div className="space-y-4">
                          {selectedRfq.priorities.map(p => (
                            <div key={p} className="flex items-center gap-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl group transition-all">
                               <TrendingUp className="w-4 h-4 text-primary" />
                               <span className="text-xs font-black text-blue-300 uppercase italic">{p}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </section>

              <section className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl">
                 <div className="p-10 bg-slate-800/20 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter flex items-center gap-3">
                       <Users className="w-6 h-6 text-primary" /> Supplier Response Tracker
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" /> Submitted
                       <div className="w-2 h-2 rounded-full bg-amber-500 ml-4" /> In Progress
                    </div>
                 </div>
                 <div className="divide-y divide-slate-800">
                    {selectedRfq.suppliers.map((s, idx) => (
                      <div key={s.name} className="p-10 hover:bg-slate-800/20 transition-all group">
                         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
                            <div className="flex items-center gap-8">
                               <div className="w-16 h-16 rounded-[24px] bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-primary text-xl uppercase">
                                  {s.name[0]}
                               </div>
                               <div>
                                  <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1 group-hover:text-primary transition-colors">{s.name}</h4>
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{s.system}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-10">
                               <div className="text-right">
                                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Status</p>
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase italic ${
                                    s.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                                    s.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                    'bg-slate-800 text-slate-600 border-slate-700'
                                  }`}>{s.status}</span>
                               </div>
                               {s.status === 'Submitted' ? (
                                  <button className="px-6 py-2 bg-primary/10 border border-primary/30 text-primary font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all">Review Proposal</button>
                               ) : (
                                  <button className="px-6 py-2 bg-slate-800 border border-slate-700 text-slate-500 font-black rounded-xl text-[10px] uppercase tracking-widest">Awaiting File</button>
                               )}
                            </div>
                         </div>
                         
                         {s.status === 'Submitted' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-slate-800/50 animate-in slide-in-from-top-2 duration-500">
                               <div>
                                  <span className="text-[9px] text-slate-600 font-black uppercase block mb-1 italic">Cost Range</span>
                                  <p className="text-lg font-bold text-white italic">{s.quote}</p>
                               </div>
                               <div>
                                  <span className="text-[9px] text-slate-600 font-black uppercase block mb-1 italic">Lead Time</span>
                                  <p className="text-lg font-bold text-white italic">{s.delivery}</p>
                               </div>
                               <div>
                                  <span className="text-[9px] text-slate-600 font-black uppercase block mb-1 italic">Mission Alignment</span>
                                  <p className="text-lg font-bold text-emerald-400 italic">{s.alignment}</p>
                               </div>
                               <div>
                                  <span className="text-[9px] text-slate-600 font-black uppercase block mb-1 italic">Risk Profile</span>
                                  <p className={`text-lg font-bold italic ${s.risk === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}`}>{s.risk}</p>
                               </div>
                            </div>
                         )}
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           <div className="space-y-8">
              <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles className="w-24 h-24 text-primary" /></div>
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 italic border-b border-slate-800 pb-6 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" /> AI Sourcing Insights
                 </h4>
                 <div className="space-y-8">
                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-4">
                       <p className="text-sm text-slate-300 font-bold leading-relaxed italic">"Detected <span className="text-emerald-400">strong technical fit</span> from Orbital Dynamics. Alignment score is 98% based on recent ISR flight heritage records."</p>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-4 block">Evaluation Summary</p>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs font-bold uppercase italic">
                             <span className="text-slate-500">System Maturity (Avg)</span>
                             <span className="text-white">TRL-9</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold uppercase italic">
                             <span className="text-slate-500">Security Confidence</span>
                             <span className="text-emerald-400">HIGH (0.96)</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </section>

              <section className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark" />
                 <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 italic">Contracting Information</h4>
                 <div className="space-y-6">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic mb-2">Acquisition Authority</p>
                       <p className="text-xs text-slate-200 font-bold uppercase italic">USSF Space Systems Command</p>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic mb-2">Supported Vehicles</p>
                       <p className="text-xs text-slate-200 font-bold uppercase italic">IDIQ, OTA Phase II</p>
                    </div>
                 </div>
              </section>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 px-2 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar pr-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic">RFPs & RFQs</h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.3em]">Operational Acquisition Ledger • Mission-Direct Sourcing</p>
        </div>
        <button 
          onClick={() => onNavigate('Approved Solutions')}
          className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-[28px] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-primary/20 flex items-center gap-4 active:scale-95"
        >
          <ClipboardList className="w-5 h-5" /> Initialize New RFP
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[64px] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 border-b border-slate-800">
              <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Request ID</th>
              <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Mission Objective</th>
              <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Type</th>
              <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Suppliers</th>
              <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Response Rate</th>
              <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-right">Acquisition Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOCK_RFQS.map(rfq => (
              <tr 
                key={rfq.id} 
                onClick={() => setActiveRfqId(rfq.id)}
                className="hover:bg-slate-800/40 transition-all cursor-pointer group"
              >
                <td className="px-10 py-10 mono font-bold text-primary text-sm tracking-tighter uppercase">{rfq.id}</td>
                <td className="px-10 py-10">
                  <p className="text-lg font-bold text-white uppercase group-hover:text-primary transition-colors leading-none mb-2 italic tracking-tight">{rfq.mission}</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Issued: {rfq.issueDate}</p>
                </td>
                <td className="px-10 py-10 text-center">
                   <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-tighter ${rfq.type === 'RFP' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-primary/10 text-primary border-primary/30'}`}>
                      {rfq.type}
                   </span>
                </td>
                <td className="px-10 py-10 text-center font-black text-slate-300">
                   {rfq.suppliers.length}
                </td>
                <td className="px-10 py-10 text-center">
                   <div className="flex items-center justify-center gap-3">
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: `${(rfq.suppliers.filter(s => s.status === 'Submitted').length / rfq.suppliers.length) * 100}%` }} />
                      </div>
                      <span className="text-[11px] font-black text-slate-500 italic">{rfq.suppliers.filter(s => s.status === 'Submitted').length}/{rfq.suppliers.length}</span>
                   </div>
                </td>
                <td className="px-10 py-10 text-right">
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl border uppercase tracking-widest ${
                    rfq.status === 'Awarded' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    rfq.status === 'Evaluated' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                    'bg-slate-800 text-slate-500 border-slate-700 animate-pulse'
                  }`}>{rfq.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AtlasRFQs;
