
import React, { useState, useMemo } from 'react';
import { Rocket, Shield, Globe, Zap, Target, Search, Sparkles, ChevronRight, AlertTriangle, FileText, MapPin, Activity, Clock, Box, Eye, CheckCircle2, ShieldCheck, ClipboardList, TrendingUp, Info, ArrowLeft, MessageSquare, Send, Check } from 'lucide-react';
import { logAction } from '../services/auditService';

interface AtlasMissionIntakeProps {
  onNavigate: (view: string, params?: any) => void;
}

const SUGGESTED_SOLUTIONS = [
  { 
    id: 'SOL-SAT-01', 
    name: 'Tactical ISR Microsat', 
    supplier: 'Orbital Dynamics Inc.', 
    category: 'Satellite',
    role: 'High-Res Imaging', 
    status: 'Approved for Deployment',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    delivery: '60-90 Days',
    cost: '$12M - $18M',
    score: 98,
    certs: 'AS9100, ITAR, NIST L5',
    risk: 'LOW'
  },
  { 
    id: 'SOL-SAT-03', 
    name: 'Responsive PNT Array', 
    supplier: 'Astra-Geo Navigation', 
    category: 'Satellite',
    role: 'PNT Service', 
    status: 'Approved for Deployment',
    img: 'https://images.unsplash.com/photo-1517976547714-720216b864c1?auto=format&fit=crop&q=80&w=800',
    delivery: '45-60 Days',
    cost: '$8M - $11M',
    score: 95,
    certs: 'AS9100, ISO 9001',
    risk: 'LOW'
  },
  { 
    id: 'SOL-UAS-01', 
    name: 'SkyHawk UAS V4', 
    supplier: 'SkyHawk Systems', 
    category: 'UAS',
    role: 'Tactical ISR Drone', 
    status: 'In Testing',
    img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    delivery: '30 Days',
    cost: '$1.2M - $2M',
    score: 88,
    certs: 'NIST 800-171, FAA L3',
    risk: 'MED'
  }
];

const AtlasMissionIntake: React.FC<AtlasMissionIntakeProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<'NONE' | 'CONSULTATION' | 'RFP' | 'COMPARISON' | 'CONFIRM_RFP' | 'CONFIRM_CONSULTATION'>('NONE');
  const [selectedConsultationSolution, setSelectedConsultationSolution] = useState<any>(null);
  const [selectedSolutionIds, setSelectedSolutionIds] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    type: 'ISR (Intelligence, Surveillance, Recon)',
    domain: 'Low Earth Orbit (LEO)',
    timeline: 'Standard (Planned / Programmatic)',
    environment: 'Benign (Low Threat / Scientific)',
    classification: 'CUI',
    budget: '',
    description: ''
  });

  const [rfpConfig, setRfpConfig] = useState({
    deadline: '2024-01-15',
    priorities: ['Technical Performance', 'Schedule Certainty', 'Cost Efficiency'],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const handleIssueRFP = async () => {
    setAnalyzing(true);
    const selectedCount = selectedSolutionIds.size > 0 ? selectedSolutionIds.size : 3;
    await logAction('SF-USER-09', 'MISSION_RFP_ISSUED', 'MULTI-SOL', `Mission-level RFP issued for ${formData.type} requirements to ${selectedCount} systems.`);
    setTimeout(() => {
      setAnalyzing(false);
      setActiveWorkflow('CONFIRM_RFP');
    }, 1500);
  };

  const handleRequestConsultation = async (solution: any) => {
    setAnalyzing(true);
    const resourceId = solution?.id || 'GENERAL_INTAKE';
    await logAction('SF-USER-09', 'MISSION_CONSULT_REQUESTED', resourceId, `Acquisition consultation requested for mission objectives.`);
    setTimeout(() => {
      setAnalyzing(false);
      setActiveWorkflow('CONFIRM_CONSULTATION');
    }, 1500);
  };

  const toggleSolutionSelection = (id: string) => {
    const next = new Set(selectedSolutionIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedSolutionIds(next);
  };

  const openSpecificConsultation = (solution: any) => {
    setSelectedConsultationSolution(solution);
    setActiveWorkflow('CONSULTATION');
  };

  const selectedSolutions = useMemo(() => {
    if (selectedSolutionIds.size === 0) return SUGGESTED_SOLUTIONS;
    return SUGGESTED_SOLUTIONS.filter(s => selectedSolutionIds.has(s.id));
  }, [selectedSolutionIds]);

  if (activeWorkflow === 'COMPARISON') {
    return (
      <div className="space-y-8 py-10 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar pr-2">
        <div className="flex items-center justify-between px-2">
           <button onClick={() => setActiveWorkflow('NONE')} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Analysis
           </button>
           <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Suggested Solutions Comparison</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl mx-2">
           <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 italic">Decision Matrix</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Select systems to include in Mission RFP</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedSolutionIds.size || 'All'} System(s) Selected</span>
                <button 
                  disabled={selectedSolutionIds.size === 0}
                  onClick={() => setActiveWorkflow('RFP')}
                  className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all disabled:opacity-20"
                >
                  Send RFP to Selected Solutions
                </button>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                 <thead>
                    <tr className="bg-slate-800/30 border-b border-slate-800">
                       <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Selection</th>
                       <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Solution / System</th>
                       <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Supplier</th>
                       <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</th>
                       <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Match Score</th>
                       <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Est. Delivery</th>
                       <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Cost Range</th>
                       <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Compliance</th>
                       <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">View</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    {SUGGESTED_SOLUTIONS.map(sol => (
                      <tr key={sol.id} className="hover:bg-slate-800/30 transition-all group">
                         <td className="px-8 py-6">
                            <button 
                              onClick={() => toggleSolutionSelection(sol.id)}
                              className={`w-6 h-6 rounded-md border transition-all flex items-center justify-center ${
                                selectedSolutionIds.has(sol.id) ? 'bg-primary border-primary shadow-[0_0_12px_rgba(var(--primary-color-rgb),0.5)]' : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                              }`}
                            >
                               {selectedSolutionIds.has(sol.id) && <Check className="w-4 h-4 text-white" />}
                            </button>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-bold text-white uppercase italic tracking-tight">{sol.name}</p>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tighter mt-1 block w-fit ${sol.status === 'In Testing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                               {sol.status}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase italic">{sol.supplier}</td>
                         <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">{sol.category}</td>
                         <td className="px-8 py-6 text-center">
                            <div className="inline-flex items-center justify-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                               <TrendingUp className="w-3 h-3 text-emerald-500" />
                               <span className="text-sm font-black text-emerald-400 italic">{sol.score}%</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-xs font-bold text-slate-300 italic">{sol.delivery}</td>
                         <td className="px-8 py-6 text-xs font-bold text-primary italic">{sol.cost}</td>
                         <td className="px-8 py-6">
                            <div className="flex gap-1 flex-wrap max-w-[120px]">
                               {sol.certs.split(', ').map(c => <span key={c} className="text-[8px] bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-slate-500 uppercase font-black">{c}</span>)}
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => onNavigate('Approved Solutions', { solutionId: sol.id })}
                              className="p-2 hover:bg-primary/10 rounded-lg text-slate-600 hover:text-primary transition-all"
                            >
                               <ChevronRight className="w-5 h-5" />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    );
  }

  if (activeWorkflow === 'RFP') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-10 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar pr-2">
        <button onClick={() => setActiveWorkflow('COMPARISON')} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Comparison
        </button>
        <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5"><ClipboardList className="w-48 h-48 text-primary" /></div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white uppercase italic tracking-tighter">Issue Mission RFP</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Direct sourcing from Atlas Analysis Results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6 border-t border-slate-800">
             <div className="space-y-8">
                <div>
                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-3 italic">Mission Scope (Pre-filled)</label>
                   <div className="p-6 bg-slate-950 border border-slate-800 rounded-[24px] space-y-4 text-xs">
                      <div className="flex justify-between items-center text-slate-400 font-bold uppercase border-b border-slate-900 pb-2">
                         <span>Type</span>
                         <span className="text-white">{formData.type.split(' (')[0]}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 font-bold uppercase border-b border-slate-900 pb-2">
                         <span>Domain</span>
                         <span className="text-white">{formData.domain.split(' (')[0]}</span>
                      </div>
                      <p className="text-slate-500 italic leading-relaxed pt-2">
                         {formData.description || "Operational need for high-persistence ISR capability in designated orbital slots."}
                      </p>
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1 italic">Set Proposal Deadline</label>
                   <input 
                     type="date" 
                     value={rfpConfig.deadline}
                     onChange={e => setRfpConfig({...rfpConfig, deadline: e.target.value})}
                     className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-bold text-white uppercase italic outline-none focus:ring-1 focus:ring-primary"
                   />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block italic">Evaluation Priorities</label>
                   <div className="flex flex-wrap gap-3">
                      {['Technical Performance', 'Schedule Certainty', 'Cost Efficiency', 'NIST Compliance', 'Flight Heritage'].map(p => {
                        const isSelected = rfpConfig.priorities.includes(p);
                        return (
                          <button 
                            key={p} 
                            onClick={() => {
                              const next = [...rfpConfig.priorities];
                              if (next.includes(p)) setRfpConfig({...rfpConfig, priorities: next.filter(i => i !== p)});
                              else setRfpConfig({...rfpConfig, priorities: [...next, p]});
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                              isSelected ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700'
                            }`}
                          >
                             {isSelected && <CheckCircle2 className="w-3 h-3" />} {p}
                          </button>
                        );
                      })}
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="bg-slate-950/40 p-8 rounded-[32px] border border-slate-800">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Target Recipients ({selectedSolutions.length})</h4>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                     {selectedSolutions.map(s => (
                       <div key={s.id} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl group">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                             <img src={s.img} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all" alt={s.name} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-xs font-bold text-white uppercase truncate">{s.name}</p>
                             <p className="text-[9px] text-slate-500 font-bold uppercase">{s.supplier}</p>
                          </div>
                          <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                       </div>
                     ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block italic">Additional Sourcing Notes</label>
                  <textarea 
                    value={rfpConfig.notes}
                    onChange={e => setRfpConfig({...rfpConfig, notes: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-400 placeholder:text-slate-800 italic h-24 outline-none focus:ring-1 focus:ring-primary"
                    placeholder="E.g. Requesting alternate pricing for multi-unit batch..."
                  />
                </div>
             </div>
          </div>

          <button 
            disabled={analyzing}
            onClick={handleIssueRFP}
            className="w-full py-8 bg-white text-slate-900 font-black rounded-[32px] text-xl uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-105 active:scale-100 flex items-center justify-center gap-4"
          >
             {analyzing ? <Activity className="animate-spin w-8 h-8" /> : "Dispatch RFP to Selected Solutions"}
          </button>
        </div>
      </div>
    );
  }

  if (activeWorkflow === 'CONSULTATION') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-10 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar pr-2">
        <button onClick={() => { setActiveWorkflow('NONE'); setSelectedConsultationSolution(null); }} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Analysis
        </button>
        
        <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5"><MessageSquare className="w-48 h-48 text-primary" /></div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 uppercase tracking-widest">Acquisition Consultation</span>
            </div>
            <h2 className="text-4xl font-bold text-white uppercase italic tracking-tighter">
              {selectedConsultationSolution ? `Consultation for ${selectedConsultationSolution.name}` : 'Mission Solution Consultation'}
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Requesting Atlas solutions engineering support for system validation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-800">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic">Discussion Areas</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Operational Mission Fit', 'Performance Tradeoffs', 'Delivery Timeline & Risk', 'Network Integration Hubs', 'ITAR/Compliance Verification'].map(topic => (
                    <div key={topic} className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl group cursor-pointer hover:border-primary transition-all">
                      <div className="w-5 h-5 rounded-md border border-slate-700 group-hover:bg-primary/20 group-hover:border-primary flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase italic">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-slate-950/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Request Context</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                    <span className="text-slate-600">Mission Type</span>
                    <span className="text-slate-300">{formData.type.split(' (')[0]}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                    <span className="text-slate-600">Domain</span>
                    <span className="text-slate-300">{formData.domain.split(' (')[0]}</span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800">
                    <p className="text-[9px] text-slate-500 italic leading-relaxed">System metadata and mission narrative will be automatically attached for engineering review.</p>
                  </div>
                </div>
              </div>
              
              {selectedConsultationSolution && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-primary/20">
                    <img src={selectedConsultationSolution.img} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase italic">{selectedConsultationSolution.name}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">{selectedConsultationSolution.supplier}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            disabled={analyzing}
            onClick={() => handleRequestConsultation(selectedConsultationSolution)}
            className="w-full py-8 bg-primary text-white font-black rounded-[32px] text-xl uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-105 active:scale-100 flex items-center justify-center gap-4"
          >
             {analyzing ? <Activity className="animate-spin w-8 h-8" /> : <>Submit Consultation Request <Send className="w-6 h-6" /></>}
          </button>
        </div>
      </div>
    );
  }

  if (activeWorkflow === 'CONFIRM_RFP') {
     return (
        <div className="max-w-3xl mx-auto py-20 text-center space-y-12 animate-in zoom-in-95 duration-700">
           <div className="w-32 h-32 bg-emerald-500/10 border border-emerald-500/30 rounded-[48px] mx-auto flex items-center justify-center shadow-2xl">
              <ShieldCheck className="w-16 h-16 text-emerald-400" />
           </div>
           <div className="space-y-4">
              <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">RFP Dispatched</h2>
              <p className="text-xl text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                 Mission-level RFP #LB-RFP-9901 initialized. 
                 <br/>System vendors have been notified. Trace responses in <span className="text-primary italic">RFPs & RFQs</span>.
              </p>
           </div>
           <button onClick={() => onNavigate('RFPs & RFQs')} className="px-20 py-8 bg-white text-slate-900 font-black rounded-[40px] text-xl uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
              Go to RFP History
           </button>
        </div>
     );
  }

  if (activeWorkflow === 'CONFIRM_CONSULTATION') {
    return (
       <div className="max-w-3xl mx-auto py-20 text-center space-y-12 animate-in zoom-in-95 duration-700">
          <div className="w-32 h-32 bg-primary/10 border border-primary/30 rounded-[48px] mx-auto flex items-center justify-center shadow-2xl">
             <MessageSquare className="w-16 h-16 text-primary" />
          </div>
          <div className="space-y-4">
             <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Consultation Logged</h2>
             <p className="text-xl text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                The Atlas solutions engineering team has received your request. 
                <br/>A technical liaison will contact you within <span className="text-primary italic">04 business hours</span>.
              </p>
          </div>
          <button onClick={() => { setActiveWorkflow('NONE'); setSelectedConsultationSolution(null); }} className="px-20 py-8 bg-slate-900 text-white font-black rounded-[40px] text-xl uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all border border-slate-800">
             Return to Mission Results
          </button>
       </div>
    );
 }

  if (submitted) {
    return (
      <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-20 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar pr-2">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 border border-primary/30 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl">
             <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic">Mission Analysis Complete</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm italic">Launchbelt AI interpreted operational requirements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5"><Target className="w-48 h-48 text-primary" /></div>
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 border-b border-slate-800 pb-6 flex items-center gap-3">
                    Mission Interpretation
                 </h3>
                 <div className="space-y-6 relative z-10">
                    <p className="text-lg text-slate-300 font-medium leading-relaxed italic">
                      "Operational need for a rapid-response ISR platform in LEO targeting high-revisit persistent monitoring. Requires multi-spectral sensor suite with standard ITAR hardening for contested theater entry."
                    </p>
                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20">
                       <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-2 italic">Required Capability Classes</p>
                       <div className="flex flex-wrap gap-2">
                          {['Persistent Optical ISR', 'Resilient Bus Architecture', 'Tactical Downlink', 'RAD-HARD Comms'].map(c => (
                            <span key={c} className="px-3 py-1 bg-slate-950 text-slate-400 rounded-full text-[10px] font-bold border border-slate-800 uppercase italic">{c}</span>
                          ))}
                       </div>
                    </div>
                 </div>
              </section>

              {/* Acquisition Support Section */}
              <section className="bg-gradient-to-br from-primary/5 to-slate-900 border border-primary/20 rounded-[48px] p-12 shadow-2xl space-y-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp className="w-32 h-32 text-primary" /></div>
                 <div className="space-y-4 relative z-10">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Acquisition & Strategy Support</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">Atlas provides end-to-end guidance from mission intake to system selection. Use the tools below to validate requirements or initiate the procurement cycle.</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <button 
                       onClick={() => setActiveWorkflow('CONSULTATION')}
                       className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] text-left hover:border-primary/40 transition-all group/btn"
                    >
                       <Info className="w-8 h-8 text-primary mb-4" />
                       <h4 className="text-lg font-bold text-white uppercase italic leading-tight mb-2">Request Solution Consultation</h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Guidance from Atlas solutions engineering to compare and validate systems.</p>
                    </button>
                    <button 
                       onClick={() => setActiveWorkflow('RFP')}
                       className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] text-left hover:border-emerald-500/40 transition-all group/btn"
                    >
                       <ClipboardList className="w-8 h-8 text-emerald-400 mb-4" />
                       <h4 className="text-lg font-bold text-white uppercase italic leading-tight mb-2">Issue RFP to Recommended Solutions</h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Present a mission-level RFP to all 03 suggested systems to begin sourcing.</p>
                    </button>
                 </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-4">Key Constraints</h4>
                    <ul className="space-y-4">
                       {['Rapid De-orbit Capability', 'High-bandwidth Encryption', 'Multi-Node Crosslink Support'].map(c => (
                         <li key={c} className="flex items-center gap-3 text-xs font-bold text-slate-200">
                            <Zap className="w-4 h-4 text-primary" /> {c}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-4">Risk Factors</h4>
                    <ul className="space-y-4">
                       {['Supply Chain Lead-time for Opticals', 'Radiation Hardening Verification', 'Contested Thermal Profile'].map(r => (
                         <li key={r} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            <AlertTriangle className="w-4 h-4 text-primary" /> {r}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <section className="bg-primary/5 border border-primary/20 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-10 block italic">Top Match Profile</h4>
                 <div className="text-center space-y-6">
                    <div className="w-full aspect-video rounded-[32px] overflow-hidden border border-primary/20 shadow-2xl">
                       <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700" alt="Primary Match" />
                    </div>
                    <div>
                       <p className="text-2xl font-black text-white uppercase italic tracking-tighter">Tactical ISR Microsat</p>
                       <p className="text-[10px] text-slate-500 font-black uppercase mt-1 italic">Orbital Dynamics Inc.</p>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 bg-slate-950/60 rounded-2xl border border-primary/20">
                       <span className="text-[10px] font-black text-slate-600 uppercase italic">Mission Confidence</span>
                       <span className="text-primary font-black text-sm italic">98%</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => setActiveWorkflow('COMPARISON')}
                  className="w-full mt-8 py-6 bg-primary hover:bg-primary-dark text-white font-black rounded-[32px] text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all scale-105 active:scale-100 flex items-center justify-center gap-4"
                 >
                   Compare suggested solutions <ChevronRight className="w-5 h-5" />
                 </button>
              </section>
           </div>
        </div>

        {/* Suggested Solutions Strip */}
        <section className="space-y-8 px-2">
           <div className="flex items-center gap-4">
              <div className="h-px bg-slate-800 flex-1" />
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] italic">Recommended Systems</h3>
              <div className="h-px bg-slate-800 flex-1" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SUGGESTED_SOLUTIONS.map(sol => (
                 <div key={sol.id} className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden group hover:border-primary/40 transition-all shadow-xl">
                    <div className="h-48 overflow-hidden relative">
                       <img src={sol.img} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" alt={sol.name} />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                       <div className="absolute bottom-4 left-6">
                          <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase italic ${sol.status === 'Approved for Deployment' ? 'bg-emerald-500/80 text-white border-emerald-400' : 'bg-amber-500/80 text-white border-amber-400'}`}>{sol.status.split(' for')[0]}</span>
                       </div>
                    </div>
                    <div className="p-8 space-y-6">
                       <div>
                          <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">{sol.name}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{sol.supplier}</p>
                       </div>
                       <div className="flex flex-col gap-2 pt-6 border-t border-slate-800">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-slate-600 uppercase italic">{sol.role}</span>
                            <button 
                              onClick={() => onNavigate('Approved Solutions', { solutionId: sol.id })}
                              className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2"
                            >
                              View <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => openSpecificConsultation(sol)}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-xl text-[9px] uppercase tracking-widest border border-slate-700 transition-all flex items-center justify-center gap-2"
                          >
                             <MessageSquare className="w-3 h-3" /> Request Consultation
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 animate-in fade-in duration-1000 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar pr-2">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Mission Intake</h1>
        <div className="p-8 bg-primary/5 border border-primary/20 rounded-[32px] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-5"><Sparkles className="w-16 h-16 text-primary" /></div>
           <p className="text-lg text-slate-300 font-medium leading-relaxed italic">
             Atlas is a secure procurement intelligence system. Describe your mission objectives below, and we will translate your operational needs into approved, flight-ready systems and verified suppliers.
           </p>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs italic leading-relaxed">
          Operational Intake Protocol • NIST 800-171 SECURE SESSION
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-16 rounded-[64px] shadow-2xl space-y-12 relative overflow-hidden mx-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 relative z-10">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Mission Type
            </label>
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none italic"
            >
              <option>ISR (Intelligence, Surveillance, Recon)</option>
              <option>Tactical Communications</option>
              <option>Position, Nav, and Timing (PNT)</option>
              <option>Responsive Launch / Deploy</option>
              <option>On-Orbit Servicing & Test</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Domain
            </label>
            <select 
              value={formData.domain}
              onChange={e => setFormData({...formData, domain: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all italic"
            >
              <option>Low Earth Orbit (LEO)</option>
              <option>Medium Earth Orbit (MEO)</option>
              <option>Geosynchronous (GEO)</option>
              <option>Cis-Lunar Space</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Delivery Timeline
            </label>
            <select 
              value={formData.timeline}
              onChange={e => setFormData({...formData, timeline: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all italic">
              <option>Standard (Planned / Programmatic)</option>
              <option>Urgent / Responsive (&lt; 90 Days)</option>
              <option>Future Capability (Long Range)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Operating Environment
            </label>
            <select 
              value={formData.environment}
              onChange={e => setFormData({...formData, environment: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all italic">
              <option>Benign (Low Threat / Scientific)</option>
              <option>Contested (Defense Operations)</option>
              <option>Highly Contested (Active Conflict)</option>
            </select>
          </div>

          <div className="space-y-3 col-span-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Mission Narrative
            </label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the operational need in mission language..."
              className="w-full bg-slate-950 border border-slate-800 rounded-[32px] p-8 text-xl font-medium text-white outline-none focus:ring-2 focus:ring-primary/50 h-48 placeholder:text-slate-800 leading-relaxed italic"
            />
          </div>
        </div>

        <div className="flex justify-center relative z-10 pt-6">
          <button 
            type="submit"
            disabled={analyzing}
            className="px-24 py-8 bg-primary hover:bg-primary-dark text-white font-black rounded-[40px] text-xl uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all scale-105 active:scale-100 flex items-center justify-center gap-6 group"
          >
            {analyzing ? (
              <>
                <Activity className="w-8 h-8 animate-spin" /> Analyzing Mission...
              </>
            ) : (
              <>
                Analyze Mission & Find Solutions <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AtlasMissionIntake;
