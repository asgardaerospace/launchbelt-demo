
import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, ChevronRight, FileBox, 
  FlaskConical, LayoutGrid, ClipboardList, ShieldCheck, 
  Zap, Sparkles, AlertTriangle, Box, Target, 
  Clock, MapPin, Upload, Lock, FileText, Activity
} from 'lucide-react';
import { WorkPackageStatus, Role, Part } from '../types';

enum WizardStep {
  SCOPE = 0,
  PARTS = 1,
  TDP = 2,
  AI_REVIEW = 3,
  CHECKLIST = 4
}

const WorkPackageWizard: React.FC<{ onBack: () => void; onFinish: () => void }> = ({ onBack, onFinish }) => {
  const [step, setStep] = useState<WizardStep>(WizardStep.SCOPE);
  const [formData, setFormData] = useState({
    program: 'NightOwl-V4',
    title: '',
    description: '',
    criticality: 'MEDIUM',
    delivery: '',
    destination: 'Asgard Forge - Central'
  });
  const [parts, setParts] = useState<Part[]>([]);
  const [baselineLocked, setBaselineLocked] = useState(false);
  const [checklist, setChecklist] = useState({
    scopeLocked: false,
    bomValidated: false,
    complianceChecked: false,
    securityCleared: false
  });

  const steps = [
    "Define Scope",
    "Parts Matrix",
    "TDP Baseline",
    "AI Compliance",
    "Ready for RFQ"
  ];

  const renderStep = () => {
    switch (step) {
      case WizardStep.SCOPE: return <StepScope onNext={() => setStep(WizardStep.PARTS)} data={formData} setData={setFormData} />;
      case WizardStep.PARTS: return <StepParts onNext={() => setStep(WizardStep.TDP)} parts={parts} setParts={setParts} />;
      case WizardStep.TDP: return <StepTDP onNext={() => setStep(WizardStep.AI_REVIEW)} locked={baselineLocked} setLocked={setBaselineLocked} />;
      case WizardStep.AI_REVIEW: return <StepAIReview onNext={() => setStep(WizardStep.CHECKLIST)} />;
      case WizardStep.CHECKLIST: return <StepChecklist onFinish={onFinish} checklist={checklist} setChecklist={setChecklist} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-all" />
          Cancel Creation
        </button>
        <div className="flex items-center gap-1">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-all border ${
                step >= i 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20' 
                  : 'bg-slate-900 text-slate-600 border-slate-800'
              }`}>
                {i + 1}. {s}
              </div>
              {i < steps.length - 1 && <div className="w-4 h-px bg-slate-800 mx-1" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="min-h-[60vh]">
        {renderStep()}
      </div>
    </div>
  );
};

// --- Wizard Step 1: SCOPE ---
const StepScope: React.FC<{ onNext: () => void; data: any; setData: any }> = ({ onNext, data, setData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl space-y-10">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="w-7 h-7 text-blue-500" />
          Define Work Package Scope
        </h3>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mission Program</label>
            <input 
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" 
              value={data.program} 
              onChange={e => setData({...data, program: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Criticality Rating</label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm text-white outline-none"
              value={data.criticality}
              onChange={e => setData({...data, criticality: e.target.value})}
            >
              <option value="LOW">STANDARD</option>
              <option value="MEDIUM">HIGH</option>
              <option value="MISSION_CRITICAL">MISSION CRITICAL (L5)</option>
            </select>
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Package Title</label>
            <input 
              placeholder="e.g., Primary Chassis Machining Block A"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" 
              value={data.title} 
              onChange={e => setData({...data, title: e.target.value})}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Integration Destination (Hub)</label>
            <div className="grid grid-cols-3 gap-4">
               {['Central', 'Rocky Mountain', 'Great Lakes'].map(loc => (
                 <button 
                  key={loc}
                  onClick={() => setData({...data, destination: `Asgard Forge - ${loc}`})}
                  className={`p-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                    data.destination.includes(loc) ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
                  }`}
                 >
                   <MapPin className="w-4 h-4" />
                   {loc}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={onNext} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-blue-600/30 uppercase tracking-widest text-xs">
          Capture Scope & Proceed <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
        <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-6 border-b border-slate-800 pb-4">Creation Strategy</h4>
        <p className="text-sm text-slate-400 leading-relaxed font-medium">
          Establishing a clear scope is the foundation of the technical baseline. Define mission criticality to trigger appropriate ITAR and security protocols across the network.
        </p>
      </div>
    </div>
  </div>
);

// --- Wizard Step 2: PARTS ---
const StepParts: React.FC<{ onNext: () => void; parts: Part[]; setParts: any }> = ({ onNext, parts, setParts }) => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div className="lg:col-span-3 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-tighter">
            <LayoutGrid className="w-6 h-6 text-blue-500" />
            Build Matrix / BOM
          </h3>
          <button onClick={() => setParts([...parts, { id: Date.now().toString(), partNumber: '', revision: 'A', name: '', quantityRequired: 1 }])} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-slate-700 font-bold transition-all">+ Add Component</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/20 border-b border-slate-800">
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Part ID</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Description</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Primary Process</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-right">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {parts.length === 0 ? (
               <tr><td colSpan={4} className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest italic">No parts defined in baseline</td></tr>
            ) : (
              parts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-8 py-6">
                    <input className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none w-32 font-bold mono" placeholder="PN-000" />
                  </td>
                  <td className="px-8 py-6">
                    <input className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none w-full" placeholder="Internal name..." />
                  </td>
                  <td className="px-8 py-6">
                    <select className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-[10px] text-slate-400 font-bold uppercase outline-none">
                       <option>CNC Machining</option>
                       <option>Additive (Metal)</option>
                       <option>Composite Layup</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <input type="number" className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none w-16 text-center" defaultValue={1} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end pt-4">
        <button onClick={onNext} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/30 uppercase tracking-widest text-xs">Lock Matrix & Proceed</button>
      </div>
    </div>
    <div className="space-y-6">
       <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-8 rounded-[40px] shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3 text-indigo-400 mb-6">
             <Sparkles className="w-6 h-6" />
             <span className="font-bold text-xs tracking-widest uppercase italic">AI Structure Assist</span>
          </div>
          <div className="space-y-6">
             <div className="p-5 bg-slate-900/60 rounded-2xl border border-indigo-500/10">
                <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                  "Based on program 'NightOwl-V4', you may be missing standard 'NDI Test' certification requirements for structural chassis components."
                </p>
                <button className="mt-4 text-[10px] text-indigo-400 font-bold uppercase hover:underline">+ Add NDI Requirements</button>
             </div>
          </div>
       </div>
    </div>
  </div>
);

// --- Wizard Step 3: TDP ---
const StepTDP: React.FC<{ onNext: () => void; locked: boolean; setLocked: any }> = ({ onNext, locked, setLocked }) => (
  <div className="max-w-4xl mx-auto space-y-10">
    <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-16 shadow-2xl text-center space-y-10 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
       <div className="flex flex-col items-center gap-6">
          <div className="bg-blue-600/10 p-8 rounded-[32px] border border-blue-500/20 shadow-2xl">
             <FileBox className="w-16 h-16 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-white tracking-tight uppercase">Technical Data Package (TDP)</h3>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">Upload specifications, CAD baselines, and quality plans.</p>
          </div>
       </div>

       <div className="border-2 border-dashed border-slate-800 rounded-[40px] p-16 flex flex-col items-center justify-center gap-6 bg-slate-950/40 hover:border-blue-500/50 transition-all cursor-pointer group">
          <Upload className="w-10 h-10 text-slate-600 group-hover:text-blue-400 group-hover:-translate-y-1 transition-all" />
          <div className="space-y-1">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Drag and drop files here</p>
             <p className="text-[10px] text-slate-600 font-medium">STEP, PDF, DXF, XLSX (Max 2GB per package)</p>
          </div>
       </div>

       <div className="flex items-center justify-between p-8 bg-slate-800/40 rounded-3xl border border-slate-700 shadow-inner">
          <div className="flex items-center gap-5 text-left">
             <div className={`p-4 rounded-2xl transition-all ${locked ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-slate-900 border border-slate-700'}`}>
                <Lock className={`w-6 h-6 ${locked ? 'text-white' : 'text-slate-500'}`} />
             </div>
             <div>
                <p className="text-sm font-bold text-white uppercase tracking-tight">Lock Technical Baseline</p>
                <p className="text-[10px] text-slate-500 font-medium italic">Prevents further edits after compliance check.</p>
             </div>
          </div>
          <button 
            onClick={() => setLocked(!locked)}
            className={`px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
              locked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/30'
            }`}
          >
            {locked ? 'BASELINE SECURED' : 'SECURE BASELINE'}
          </button>
       </div>
    </div>
    <div className="flex justify-end">
       <button 
        disabled={!locked}
        onClick={onNext} 
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-2xl shadow-blue-600/30 uppercase tracking-widest text-xs"
       >
         Initiate Compliance Scan
       </button>
    </div>
  </div>
);

// --- Wizard Step 4: AI REVIEW ---
const StepAIReview: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
     <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-12 shadow-2xl flex flex-col justify-center text-center space-y-10 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />
        <div className="flex flex-col items-center gap-4">
           <div className="w-32 h-32 bg-emerald-500/10 rounded-[40px] border border-emerald-500/20 flex items-center justify-center shadow-2xl shadow-emerald-500/10">
              <ShieldCheck className="w-16 h-16 text-emerald-500" />
           </div>
           <div className="space-y-1">
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.3em] block mb-2 italic">Verification Complete</span>
              <p className="text-6xl font-bold text-white tracking-tighter">0.96</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Compliance Confidence Score</p>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">ITAR Flags</span>
              <p className="text-xl font-bold text-emerald-400">NOMINAL</p>
           </div>
           <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">CAD Integrity</span>
              <p className="text-xl font-bold text-emerald-400">PASSED</p>
           </div>
        </div>
     </div>

     <div className="space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl space-y-8">
           <h3 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-tighter">
              <Sparkles className="w-6 h-6 text-blue-500" />
              Scan Findings & Guidance
           </h3>
           <div className="space-y-6">
              {[
                { type: 'WARNING', msg: 'Delivery window is tight for specified 5-axis process. Risk: Schedule overshoot.' },
                { type: 'GUIDANCE', msg: 'Consider federating PN-7721-A to multiple nodes to hedge lead time risk.' },
                { type: 'SYSTEM', msg: 'Security container LB-PROD-99 initiated. All TDP files cryptographically hashed.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-5 group">
                   <div className={`w-1 h-12 rounded-full transition-all group-hover:scale-y-110 ${f.type === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                   <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 italic">{f.type}</p>
                      <p className="text-[11px] text-slate-200 font-medium leading-relaxed">{f.msg}</p>
                   </div>
                </div>
              ))}
           </div>
           <button onClick={onNext} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/40 mt-6 border border-blue-400/30">
              Acknowledge & Finalize
           </button>
        </div>
     </div>
  </div>
);

// --- Wizard Step 5: CHECKLIST ---
const StepChecklist: React.FC<{ onFinish: () => void; checklist: any; setChecklist: any }> = ({ onFinish, checklist, setChecklist }) => {
  const allPassed = Object.values(checklist).every(v => v === true);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
       <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-16 shadow-2xl space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />
          <div className="text-center space-y-2">
             <h3 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Ready for Sourcing?</h3>
             <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">Perform final readiness validation before releasing to network.</p>
          </div>

          <div className="space-y-4">
             {[
               { key: 'scopeLocked', label: 'Mission Scope Finalized & Logged', desc: 'Immutable program parameters captured.' },
               { key: 'bomValidated', label: 'Build Matrix Structural Validation', desc: 'No inconsistent quantities or missing processes.' },
               { key: 'complianceChecked', label: 'Security & ITAR Posture Scan Passed', desc: 'Cryptographic hashing of baseline successful.' },
               { key: 'securityCleared', label: 'Authorized Lead Engineer Release', desc: 'Digital signature capability confirmed.' }
             ].map(item => (
               <div 
                key={item.key} 
                onClick={() => setChecklist({...checklist, [item.key]: !checklist[item.key]})}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex justify-between items-center group ${
                  checklist[item.key] ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                }`}
               >
                  <div className="flex items-center gap-5">
                     <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                       checklist[item.key] ? 'bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 border-slate-700'
                     }`}>
                        {checklist[item.key] && <CheckCircle2 className="w-5 h-5 text-white" />}
                     </div>
                     <div>
                        <p className={`text-sm font-bold transition-all ${checklist[item.key] ? 'text-emerald-400' : 'text-slate-300'}`}>{item.label}</p>
                        <p className="text-[10px] text-slate-500 font-medium italic mt-0.5">{item.desc}</p>
                     </div>
                  </div>
               </div>
             ))}
          </div>

          <button 
            disabled={!allPassed}
            onClick={onFinish}
            className={`w-full py-6 rounded-[32px] font-bold text-xs uppercase tracking-[0.2em] transition-all scale-105 active:scale-100 ${
              allPassed ? 'bg-white text-slate-900 shadow-[0_0_50px_rgba(255,255,255,0.1)]' : 'bg-slate-800 text-slate-600 opacity-50'
            }`}
          >
            Release Work Package to Supply Network
          </button>
       </div>
    </div>
  );
};

export default WorkPackageWizard;
