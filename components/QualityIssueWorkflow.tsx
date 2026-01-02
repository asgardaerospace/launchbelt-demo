
import React, { useState } from 'react';
import { AlertTriangle, ChevronRight, Camera, ArrowLeft, ShieldAlert, CheckCircle2, Activity, User, Target, Lock, FileImage } from 'lucide-react';
import { logAction } from '../services/auditService';

interface QualityIssueWorkflowProps {
  context: any;
  onCancel: () => void;
  onFinish: () => void;
}

const QualityIssueWorkflow: React.FC<QualityIssueWorkflowProps> = ({ context, onCancel, onFinish }) => {
  const [step, setStep] = useState(1);
  const [issueType, setIssueType] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'Minor' | 'Major' | 'Critical'>('Minor');
  const [containment, setContainment] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [isPhotoAttached, setIsPhotoAttached] = useState(false);

  const issueTypes = [
    'Wrong material', 'Wrong setup/fixture', 'Out-of-tolerance',
    'Surface defect', 'Process deviation', 'Equipment fault',
    'Documentation mismatch', 'Other'
  ];

  const handleToggleContainment = (c: string) => {
    setContainment(prev => prev.includes(c) ? prev.filter(i => i !== c) : [...prev, c]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await logAction('OP-A1', 'QUALITY_ISSUE_FLAGGED', context?.wo || 'UNKNOWN', `Flagged ${issueType} - Severity: ${severity}`);
    setTimeout(() => setStep(5), 1500);
  };

  const simulatePhotoCapture = () => {
    setIsPhotoAttached(true);
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-white animate-in fade-in duration-500 overflow-hidden">
      {/* Region A: Fixed Header */}
      <div className="p-8 border-b border-slate-800 bg-red-600/5 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-red-600/20 rounded-2xl border border-red-500/30 text-red-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Flag Quality Issue</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Ref: {context?.wo} • {context?.part} • {context?.station}</p>
          </div>
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
           <ArrowLeft className="w-4 h-4" /> Cancel Entry
        </button>
      </div>

      {/* Region B: Scrollable Step Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center justify-center p-12 min-h-full">
          {step === 1 && (
            <div className="w-full max-w-5xl space-y-12 animate-in slide-in-from-right-8 duration-500 py-8">
               <div className="text-center">
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-4">1. Select Issue Type</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest">Identify the primary nature of the non-conformance.</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {issueTypes.map(type => (
                    <button 
                      key={type}
                      onClick={() => setIssueType(type)}
                      className={`p-10 rounded-[32px] border text-center font-black text-sm uppercase tracking-widest transition-all ${
                        issueType === type ? 'bg-red-600 text-white border-red-400 shadow-2xl' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-red-500/40 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
               </div>
               <div className="flex justify-center pt-8">
                  <button 
                    disabled={!issueType}
                    onClick={() => setStep(2)}
                    className="px-20 py-8 bg-white text-slate-900 font-black rounded-[40px] text-xl uppercase tracking-widest shadow-2xl disabled:opacity-30 disabled:grayscale transition-all"
                  >
                    Continue
                  </button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="w-full max-w-5xl space-y-12 animate-in slide-in-from-right-8 duration-500 py-8">
               <div className="text-center">
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-4">2. Evidence & Description</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest">Provide diagnostic details and capture visual proof.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start pb-12">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Problem Statement</label>
                        <textarea className="w-full bg-slate-900 border border-slate-800 rounded-[32px] p-8 text-xl font-medium outline-none focus:ring-2 focus:ring-red-600 h-48 placeholder:text-slate-800" placeholder="Briefly describe what happened..." />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Severity Class</label>
                        <div className="flex flex-wrap gap-4">
                           {['Minor', 'Major', 'Critical'].map(s => (
                             <button 
                                key={s} 
                                onClick={() => setSeverity(s as any)}
                                className={`flex-1 py-6 min-w-[120px] rounded-[24px] border font-black text-xs uppercase tracking-widest transition-all ${
                                  severity === s ? 'bg-red-600 text-white border-red-400 shadow-xl' : 'bg-slate-900 border-slate-800 text-slate-600'
                                }`}
                             >
                                {s}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Visual Evidence (Simulated)</label>
                     <button 
                        onClick={simulatePhotoCapture}
                        className={`w-full aspect-square bg-slate-900 border-4 border-dashed rounded-[48px] flex flex-col items-center justify-center gap-6 group transition-all ${
                          isPhotoAttached ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 hover:border-red-500/40'
                        }`}
                      >
                        {isPhotoAttached ? (
                          <>
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            </div>
                            <p className="text-emerald-500 font-black uppercase tracking-widest italic">Evidence Attached</p>
                          </>
                        ) : (
                          <>
                            <FileImage className="w-20 h-20 text-slate-700 group-hover:text-red-500 group-hover:-translate-y-2 transition-all" />
                            <p className="text-slate-600 font-black uppercase tracking-widest italic text-center">Attach Forensic Evidence<br/><span className="text-[8px] opacity-60">(Simulation Mode)</span></p>
                          </>
                        )}
                     </button>
                  </div>
               </div>
               <div className="flex justify-center pb-12">
                  <button onClick={() => setStep(3)} className="px-20 py-8 bg-white text-slate-900 font-black rounded-[40px] text-xl uppercase tracking-widest shadow-2xl">Set Containment</button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="w-full max-w-5xl space-y-12 animate-in slide-in-from-right-8 duration-500 py-8">
               <div className="text-center">
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-4">3. Containment Action</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest">Control immediate risk to the network.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'HOLD', label: 'Place part on Hold', icon: Lock },
                    { id: 'STATION', label: 'Pause station', icon: Activity },
                    { id: 'QA', label: 'Request QA review', icon: Target },
                    { id: 'SUPER', label: 'Supervisor assistance', icon: User }
                  ].map(c => (
                    <button 
                      key={c.id}
                      onClick={() => handleToggleContainment(c.id)}
                      className={`p-10 rounded-[32px] border flex items-center gap-8 text-left transition-all ${
                        containment.includes(c.id) ? 'bg-red-600/10 border-red-500/50 shadow-2xl' : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      <div className={`p-4 rounded-2xl border ${containment.includes(c.id) ? 'bg-red-600 text-white' : 'bg-slate-950 border-slate-800'}`}>
                         <c.icon className="w-8 h-8" />
                      </div>
                      <span className={`text-2xl font-black uppercase italic tracking-tighter ${containment.includes(c.id) ? 'text-white' : 'text-slate-700'}`}>{c.label}</span>
                    </button>
                  ))}
               </div>
               <div className="flex justify-center pt-8">
                  <button onClick={() => setStep(4)} className="px-20 py-8 bg-white text-slate-900 font-black rounded-[40px] text-xl uppercase tracking-widest shadow-2xl">Final Review</button>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="w-full max-w-3xl space-y-12 text-center animate-in slide-in-from-right-8 duration-500 py-8">
               <div className="space-y-4">
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter">4. Submit Record</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest leading-relaxed">By submitting, you are creating a permanent quality record in the Launchbelt Ledger. QA will be notified immediately.</p>
               </div>
               <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 text-left space-y-8 shadow-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div>
                        <p className="text-[10px] text-slate-600 font-black uppercase mb-1 italic">Issue Type</p>
                        <p className="text-xl font-bold text-white uppercase italic">{issueType}</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-600 font-black uppercase mb-1 italic">Severity</p>
                        <p className="text-xl font-bold text-red-500 uppercase italic">{severity}</p>
                     </div>
                  </div>
                  <div className="pt-6 border-t border-slate-800">
                     <p className="text-[10px] text-slate-600 font-black uppercase mb-2 italic">Active Containment</p>
                     <div className="flex flex-wrap gap-3">
                        {containment.map(c => <span key={c} className="px-4 py-1.5 bg-red-600/10 text-red-500 rounded-lg border border-red-500/20 text-[10px] font-black uppercase">{c}</span>)}
                        {containment.length === 0 && <span className="text-xs text-slate-700 italic">No containment selected</span>}
                     </div>
                  </div>
               </div>
               <button 
                 onClick={handleSubmit}
                 disabled={submitting}
                 className="w-full py-10 bg-red-600 hover:bg-red-500 text-white font-black rounded-[40px] text-2xl uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-6"
               >
                  {submitting ? <Activity className="w-10 h-10 animate-spin" /> : "Commit Non-Conformance"}
               </button>
            </div>
          )}

          {step === 5 && (
            <div className="w-full max-w-4xl text-center space-y-12 animate-in zoom-in-95 duration-700 py-20">
               <div className="w-32 h-32 bg-red-600/10 border border-red-500/30 rounded-[48px] mx-auto flex items-center justify-center shadow-2xl">
                  <CheckCircle2 className="w-16 h-16 text-red-500" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none">Record Logged</h3>
                  <p className="text-xl text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                     NCR #LB-QC-9921-X created successfully. 
                     {containment.includes('HOLD') ? <span className="text-red-500 block mt-2">PART PLACED ON PHYSICAL HOLD</span> : <span className="block mt-2">Awaiting remote QA review</span>}
                  </p>
               </div>
               <div className="pt-12">
                  <button 
                    onClick={onFinish}
                    className="px-20 py-8 bg-white text-slate-900 font-black rounded-[40px] text-xl uppercase tracking-widest shadow-2xl transition-all"
                  >
                    Return to Base
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityIssueWorkflow;
