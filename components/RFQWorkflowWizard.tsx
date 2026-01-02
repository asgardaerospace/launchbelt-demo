
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, ChevronRight, Search, FileText, CheckCircle2, 
  Sparkles, AlertTriangle, ShieldCheck, Users, Zap, 
  MapPin, Clock, DollarSign, Activity, Box, Filter, 
  Layers, Package, TrendingUp, FlaskConical, Target,
  // Added missing Eye icon import
  Eye
} from 'lucide-react';
import { WorkPackage, WorkPackageStatus } from '../types';

enum WizardStep {
  SELECT_WP = 0,
  SCOPE = 1,
  RISK_PLAN = 2,
  RECIPIENTS = 3,
  BID_TRACKER = 4,
  QUOTE_COMPARE = 5,
  AWARD = 6,
  BUILD_TRACKER = 7
}

const MOCK_WPS: WorkPackage[] = [
  {
    id: 'WP-2047',
    title: 'UAS Payload Mount Bracket',
    program: 'NightOwl-V3',
    owner: 'Sarah Connor',
    status: WorkPackageStatus.APPROVED,
    description: 'Structural component for sensor payload integration. Requires precision milling and aerospace coating.',
    createdAt: '2023-11-10',
    tdp: { id: 'TDP-2047', version: 'C', files: [], lastModified: '' },
    parts: [{ id: 'P-1', partNumber: '7721-001', revision: 'C', name: 'Main Mount', quantityRequired: 120 }]
  }
];

const RFQWorkflowWizard: React.FC<{ onBack: () => void; onFinish: () => void }> = ({ onBack, onFinish }) => {
  const [step, setStep] = useState<WizardStep>(WizardStep.SELECT_WP);
  const [selectedWP, setSelectedWP] = useState<WorkPackage | null>(null);
  const [qaApproved, setQaApproved] = useState(false);

  const steps = [
    "Select Package",
    "Scope + Requirements",
    "AI Risk + Facility Plan",
    "Recipients + Release",
    "Live Bid Tracker",
    "Quote Comparison",
    "Award Confirmation",
    "Build Tracker"
  ];

  const renderStep = () => {
    switch (step) {
      case WizardStep.SELECT_WP: return <StepSelectWP onNext={() => setStep(WizardStep.SCOPE)} onSelect={setSelectedWP} selected={selectedWP} />;
      case WizardStep.SCOPE: return <StepScope onNext={() => setStep(WizardStep.RISK_PLAN)} />;
      case WizardStep.RISK_PLAN: return <StepRiskPlan onNext={() => setStep(WizardStep.RECIPIENTS)} />;
      case WizardStep.RECIPIENTS: return <StepRecipients onNext={() => setStep(WizardStep.BID_TRACKER)} qaApproved={qaApproved} setQaApproved={setQaApproved} />;
      case WizardStep.BID_TRACKER: return <StepBidTracker onNext={() => setStep(WizardStep.QUOTE_COMPARE)} />;
      case WizardStep.QUOTE_COMPARE: return <StepQuoteCompare onNext={() => setStep(WizardStep.AWARD)} />;
      case WizardStep.AWARD: return <StepAward onNext={() => setStep(WizardStep.BUILD_TRACKER)} />;
      case WizardStep.BUILD_TRACKER: return <StepBuildTracker onFinish={onFinish} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-all" />
          Cancel Bid Workflow
        </button>
        <div className="flex items-center gap-1">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all ${
                step >= i ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-500'
              }`}>
                {i + 1}. {s}
              </div>
              {i < steps.length - 1 && <div className="w-4 h-px bg-slate-800 mx-1" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="min-h-[70vh]">
        {renderStep()}
      </div>
    </div>
  );
};

// --- FRAME 2: SELECT WP ---
const StepSelectWP: React.FC<{ onNext: () => void; onSelect: (wp: WorkPackage) => void; selected: WorkPackage | null }> = ({ onNext, onSelect, selected }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Package className="w-6 h-6 text-blue-500" />
          Select Target Work Package
        </h3>
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-1 focus:ring-blue-500" placeholder="Filter approved packages..." />
        </div>
        <div className="space-y-3">
          {MOCK_WPS.map(wp => (
            <div 
              key={wp.id} 
              onClick={() => onSelect(wp)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex justify-between items-center group ${
                selected?.id === wp.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-slate-800/30 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="text-sm font-bold text-white uppercase">{wp.title}</p>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">
                  <span>{wp.id}</span> • <span>{wp.program}</span> • <span>Rev {wp.tdp.version}</span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-700 group-hover:text-blue-400 transition-all ${selected?.id === wp.id ? 'text-blue-400 translate-x-1' : ''}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4 mb-6">Selection Preview</h4>
        {selected ? (
          <div className="space-y-6">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
               <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Scope Details</span>
               <p className="text-xs text-slate-300 leading-relaxed">{selected.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/30 p-4 rounded-xl text-center border border-slate-800">
                 <span className="text-[10px] text-slate-500 font-bold uppercase block">Planned Qty</span>
                 <p className="text-xl font-bold text-white">{selected.parts[0].quantityRequired}</p>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-xl text-center border border-slate-800">
                 <span className="text-[10px] text-slate-500 font-bold uppercase block">Tier</span>
                 <p className="text-xl font-bold text-emerald-400">Vetted</p>
              </div>
            </div>
            <button onClick={onNext} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30">Next: Scope + Requirements</button>
          </div>
        ) : (
          <p className="text-xs text-slate-600 italic">Select a package to continue.</p>
        )}
      </div>
    </div>
  </div>
);

// --- FRAME 3: SCOPE ---
const StepScope: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div className="lg:col-span-3 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-4">RFQ Definition Matrix</h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase block">Delivery Cadence</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm font-bold text-slate-200 outline-none">
              <option>Single Batch Drop</option>
              <option>Monthly Deliveries (12mo)</option>
              <option>Just-in-Time (JIT)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase block">Target Ship-To Location</label>
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm font-bold text-slate-300">
               <MapPin className="w-4 h-4 text-blue-500" />
               Asgard Forge - Austin TX
            </div>
          </div>
          <div className="space-y-4 col-span-2">
             <label className="text-[10px] text-slate-500 font-bold uppercase block">Required Compliance Artifacts</label>
             <div className="grid grid-cols-3 gap-4">
                {['Cert of Conformance', 'Raw Material MTR', 'First Article (FAI)', 'NADCAP Special Process', 'NDI Test Reports', 'CMM Dimensions'].map(c => (
                  <div key={c} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-[10px] font-bold text-slate-400 group cursor-pointer hover:border-blue-500 transition-all">
                     <div className="w-4 h-4 rounded border border-slate-600 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white opacity-0 group-hover:opacity-100" />
                     </div>
                     {c}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4">
         <button onClick={onNext} className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/40 uppercase tracking-widest text-xs">Run AI Risk + Facility Plan</button>
      </div>
    </div>
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-indigo-500/30 p-8 rounded-3xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-indigo-400 mb-6">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold text-[10px] tracking-widest uppercase">AI Assist: Requirements</span>
        </div>
        <div className="text-center mb-8">
           <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest">Completeness Score</span>
           <p className="text-5xl font-bold text-white mt-2">86<span className="text-xl text-indigo-500">/100</span></p>
        </div>
        <div className="space-y-5">
           <h4 className="text-[10px] text-slate-400 uppercase font-bold">Missing / Ambiguous Items</h4>
           <ul className="space-y-3">
              <li className="flex items-start gap-3 text-[10px] text-slate-300 font-medium">
                 <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                 Coating specification (ASTM/MIL) not explicitly referenced in WP scope.
              </li>
              <li className="flex items-start gap-3 text-[10px] text-slate-300 font-medium">
                 <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                 Surface finish Ra value is ambiguous for non-critical faces.
              </li>
           </ul>
           <div className="flex flex-wrap gap-2 pt-2">
              {['Add Coating Spec', 'Define Ra Plan'].map(chip => (
                <button key={chip} className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/40 transition-all uppercase tracking-tighter">
                   + {chip}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  </div>
);

// --- FRAME 4: AI RISK REVIEW + PLAN ---
const StepRiskPlan: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="space-y-8">
       <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Schedule Risk', val: 'MEDIUM', color: 'text-amber-400' },
            { label: 'Quality Risk', val: 'MEDIUM', color: 'text-amber-400' },
            { label: 'Compliance Risk', val: 'HIGH (ITAR)', color: 'text-red-400' },
            { label: 'AI Confidence', val: '0.78', color: 'text-emerald-400' }
          ].map(c => (
            <div key={c.label} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center">
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{c.label}</span>
               <p className={`text-xl font-bold mt-2 ${c.color}`}>{c.val}</p>
            </div>
          ))}
       </div>
       <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 space-y-6 shadow-2xl">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
             <AlertTriangle className="w-6 h-6 text-red-500" />
             AI Risk Register
          </h3>
          <div className="space-y-5">
             {[
               { cat: 'Quality', desc: 'Tight tolerance on internal bore may require 5-axis probing capability at setup.', sev: 'HIGH' },
               { cat: 'Schedule', desc: 'Anodizing vendor availability in West region is a typical 6-day bottleneck.', sev: 'MED' },
               { cat: 'Compliance', desc: 'ITAR Flagged: restricts recipients to vetted US-only clear facilities.', sev: 'HIGH' }
             ].map(r => (
               <div key={r.desc} className="p-5 bg-slate-800/30 border border-slate-800 rounded-3xl hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${
                        r.sev === 'HIGH' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                     }`}>{r.cat} / {r.sev} SEVERITY</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed italic">{r.desc}</p>
               </div>
             ))}
          </div>
       </div>
    </div>
    <div className="space-y-8">
       <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 flex flex-col h-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full" />
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
             <TrendingUp className="w-6 h-6 text-blue-500" />
             Recommended Facility Plan
          </h3>
          <div className="space-y-6 relative z-10 flex-1">
             {[
               { icon: FlaskConical, label: 'CNC Machining', node: 'Apex Aerospace (Austin, TX)', reason: '5-Axis + Probing, OTD 96%', time: '14 Days' },
               { icon: Zap, label: 'Aerospace Coating', node: 'Great Lakes Heavy Fab (Midwest)', reason: 'Certified vendor, queue ~6 days', time: '8 Days' },
               { icon: Target, label: 'Integration Destination', node: 'Asgard Forge (Austin, TX)', reason: 'Primary Hub for NightOwl Program', time: 'Final Step' }
             ].map((step, i) => (
               <div key={step.label} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                     <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-blue-600/20 group-hover:border-blue-500/50 transition-all">
                        <step.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                     </div>
                     {i < 2 && <div className="w-px flex-1 bg-slate-800 my-2" />}
                  </div>
                  <div className="pb-6">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{step.label}</p>
                     <p className="text-base font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">{step.node}</p>
                     <p className="text-[10px] text-slate-500 font-bold mt-1 italic">{step.reason} • {step.time}</p>
                  </div>
               </div>
             ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 flex gap-4 relative z-10">
             <button onClick={onNext} className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-[24px] shadow-lg shadow-blue-600/30 transition-all">Accept AI Plan</button>
             <button className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-[24px] border border-slate-700 transition-all">Edit Custom Plan</button>
          </div>
       </div>
    </div>
  </div>
);

// --- FRAME 5/6: RECIPIENTS + QA GATE ---
const StepRecipients: React.FC<{ onNext: () => void; qaApproved: boolean; setQaApproved: (b: boolean) => void }> = ({ onNext, qaApproved, setQaApproved }) => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div className="lg:col-span-3 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/10">
           <h3 className="text-xl font-bold text-white">Suggested Sourcing Targets</h3>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">3 Vetted Sources Selected</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/20 border-b border-slate-800">
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Supplier / Facility</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-center">Match %</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-center">Security</th>
               <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-right">Capacity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {[
              { name: 'Apex Aerospace Solutions', loc: 'Austin, TX', match: 98, security: 'ITAR', cap: 'HEALTHY' },
              { name: 'Desert Heat Composites', loc: 'Phoenix, AZ', match: 92, security: 'ITAR', cap: 'HEALTHY' },
              { name: 'Great Lakes Heavy Fab', loc: 'Chicago, IL', match: 86, security: 'CUI', cap: 'WARNING' }
            ].map(s => (
              <tr key={s.name} className="hover:bg-slate-800/30 transition-colors cursor-pointer group">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded border border-blue-500 bg-blue-600 flex items-center justify-center">
                         <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{s.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{s.loc}</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6 text-center">
                   <span className="text-sm font-bold text-emerald-400">{s.match}%</span>
                </td>
                <td className="px-8 py-6 text-center">
                   <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      s.security === 'ITAR' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                   }`}>{s.security}</span>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className={`w-3 h-3 rounded-full ml-auto ${
                     s.cap === 'HEALTHY' ? 'bg-emerald-500' : 'bg-amber-500'
                   } shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div className="space-y-6">
       <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-8">
          <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-4 flex items-center gap-3 uppercase tracking-tighter">
             <ShieldCheck className={`w-5 h-5 ${qaApproved ? 'text-emerald-400' : 'text-amber-400'}`} />
             Compliance Gate
          </h4>
          <div className="space-y-6">
             <div className="space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   <div className={`w-2 h-2 rounded-full ${qaApproved ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                   Quality Approval Status
                </div>
                <p className={`text-sm font-bold px-4 py-2 rounded-xl border text-center transition-all ${
                  qaApproved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800/50 text-slate-500 border-slate-700 animate-pulse'
                }`}>
                  {qaApproved ? 'APPROVED BY QUALITY OPS' : 'PENDING QA REVIEW'}
                </p>
             </div>
             <div className="space-y-4 pt-4 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mandatory Validations</span>
                <div className="space-y-3">
                   {['Baseline Locked', 'Required Artifacts Set', 'ITAR Vetting Clear'].map(v => (
                     <div key={v} className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        {v} <CheckCircle2 className={`w-4 h-4 ${qaApproved ? 'text-emerald-400' : 'text-slate-700'}`} />
                     </div>
                   ))}
                </div>
             </div>
          </div>
          <div className="pt-6 space-y-4">
             <button 
                onClick={onNext}
                disabled={!qaApproved}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30 uppercase tracking-widest text-xs"
             >
                Release RFQ to Network
             </button>
             {!qaApproved && (
               <button 
                  onClick={() => setQaApproved(true)}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all uppercase tracking-widest text-xs"
               >
                  Request QA Approval
               </button>
             )}
          </div>
       </div>
    </div>
  </div>
);

// --- FRAME 7: LIVE BID TRACKER ---
const StepBidTracker: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="flex justify-between items-end bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-2xl overflow-hidden relative">
       <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full" />
       <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">RFQ-2047-LIVE</span>
             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" /> Due in 5d 12h
             </div>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">Payload Mount Production Sourcing</h2>
          <p className="text-slate-400 font-medium">Monitoring real-time supplier engagement and Q&A threads.</p>
       </div>
       <div className="relative z-10">
          <button onClick={onNext} className="bg-white text-slate-900 px-8 py-5 rounded-[24px] font-bold uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all flex items-center gap-3">
             View Submitted Quotes <ChevronRight className="w-5 h-5" />
          </button>
       </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Apex Aerospace', status: 'Quote Submitted', icon: CheckCircle2, color: 'text-emerald-400' },
            { name: 'Desert Heat', status: 'Quote In Progress', icon: Activity, color: 'text-blue-400' },
            { name: 'Great Lakes', status: 'Questions Submitted', icon: AlertTriangle, color: 'text-amber-400' },
            { name: 'Proto-Lab 4', status: 'Viewed', icon: Eye, color: 'text-slate-500' }
          ].map(s => (
            <div key={s.name} className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] hover:border-slate-700 transition-all group cursor-pointer shadow-xl">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 font-bold text-slate-400 uppercase group-hover:bg-blue-600/10 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">{s.name[0]}</div>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
               </div>
               <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-1">{s.name}</h4>
               <p className={`text-[10px] font-bold uppercase tracking-widest ${s.color}`}>{s.status}</p>
            </div>
          ))}
       </div>
       <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-4 mb-6">Program Watchlist</h4>
             <div className="space-y-5">
                <div className="flex gap-4 group">
                   <div className="w-1.5 h-12 bg-amber-500/30 rounded-full group-hover:bg-amber-500 transition-all" />
                   <div>
                      <p className="text-xs font-bold text-white tracking-tight uppercase">Great Lakes Fab Constraint</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 leading-relaxed">Detected capacity shortage in midwest region for Q4.</p>
                   </div>
                </div>
                <div className="flex gap-4 group">
                   <div className="w-1.5 h-12 bg-blue-500/30 rounded-full group-hover:bg-blue-50 transition-all" />
                   <div>
                      <p className="text-xs font-bold text-white tracking-tight uppercase">Tolerance Clarification</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 leading-relaxed">Desert Heat requested drill diameter confirmation.</p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
);

// --- FRAME 8: QUOTE COMPARE ---
const StepQuoteCompare: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div className="lg:col-span-3 space-y-8">
       <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
             <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                Comparison Matrix: Best Value Analysis
             </h3>
             <div className="flex gap-2">
                <button className="text-[10px] font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">Export Analysis</button>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                   <tr className="bg-slate-800/30 border-b border-slate-800">
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Vendor Detail</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-center">Total Bid</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-center">Lead Time</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-center">OTD Score</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-right">Recommendation</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                   {[
                     { name: 'Apex Aerospace', price: 42500, nre: 2500, lead: '6w', score: 96, best: true },
                     { name: 'Desert Heat', price: 38900, nre: 4000, lead: '8w', score: 91, best: false },
                     { name: 'Great Lakes Heavy', price: 51200, nre: 1500, lead: '5w', score: 88, best: false }
                   ].map(q => (
                     <tr key={q.name} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-8 py-8">
                           <p className="text-sm font-bold text-white uppercase tracking-tight">{q.name}</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Status: Vetted Per AS9100</p>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <div className="text-sm font-bold text-white flex items-center justify-center gap-1.5 italic"><DollarSign className="w-3.5 h-3.5 text-emerald-400" />{q.price.toLocaleString()}</div>
                           <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">NRE: ${q.nre}</p>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className="text-sm font-bold text-slate-300">{q.lead}</span>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className={`text-sm font-bold ${q.score > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{q.score}%</span>
                        </td>
                        <td className="px-8 py-8 text-right">
                           {q.best ? (
                             <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/30 uppercase tracking-widest flex items-center justify-end gap-2">
                                <Sparkles className="w-3.5 h-3.5" /> Best Value Selection
                             </span>
                           ) : <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Qualified Option</span>}
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
       <div className="flex justify-between items-center pt-4">
          <button className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-[24px] border border-slate-700 transition-all uppercase tracking-widest text-xs">Request BAFO</button>
          <button onClick={onNext} className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-[24px] shadow-lg shadow-emerald-600/30 transition-all uppercase tracking-widest text-xs">Award to Apex Aerospace</button>
       </div>
    </div>
    <div className="space-y-6">
       <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 p-8 rounded-[40px] shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3 text-emerald-400 mb-8">
             <Sparkles className="w-6 h-6" />
             <span className="font-bold text-xs tracking-widest uppercase italic">AI Selection Logic</span>
          </div>
          <div className="space-y-8">
             <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-4">Recommended: Apex Aerospace</span>
                <div className="space-y-4">
                   {[
                     'Shortest critical path (In-house Coating)',
                     'ITAR posture verified for L5 programs',
                     'Lowest NCR rate on similar structural components'
                   ].map(r => (
                     <div key={r} className="flex items-start gap-3 text-[10px] text-slate-200 font-medium leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {r}
                     </div>
                   ))}
                </div>
             </div>
             <div className="pt-8 border-t border-slate-800/50">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-4">Award Watchouts</span>
                <div className="space-y-4">
                   <div className="flex items-start gap-3 text-[10px] text-slate-400 font-medium leading-relaxed">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      NRE is 15% higher due to custom fixture build requirement.
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
);

// --- FRAME 9: AWARD CONFIRM ---
const StepAward: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="max-w-4xl mx-auto space-y-12 py-10 text-center animate-in zoom-in-95 duration-500">
    <div className="bg-slate-900 border border-slate-800 p-16 rounded-[64px] shadow-[0_0_100px_rgba(59,130,246,0.1)] relative overflow-hidden">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
       <div className="flex justify-center mb-10">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center border border-emerald-500/30 shadow-2xl">
             <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
       </div>
       <h2 className="text-5xl font-bold text-white tracking-tighter uppercase mb-4">Program Award Confirmed</h2>
       <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto mb-12">Program 'NightOwl-V3' has been successfully federated to Apex Aerospace. Converting bid to operational production build.</p>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 bg-slate-800/30 border border-slate-800 rounded-[32px] text-left">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 italic">Award Summary</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-slate-500 uppercase">Primary Node</span>
                   <span className="text-white">Apex (Austin TX)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-slate-500 uppercase">Integration Hub</span>
                   <span className="text-white">Asgard Forge - Central</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-slate-500 uppercase">Total Commitment</span>
                   <span className="text-emerald-400 font-bold">$42,500.00</span>
                </div>
             </div>
          </div>
          <div className="p-8 bg-slate-800/30 border border-slate-800 rounded-[32px] text-left">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 italic">Provisioning Checklist</h4>
             <div className="space-y-4">
                {['PO #LB-7712-44 Generated', 'Standard Traveler Gates Created', 'Artifact Requirements Attached', 'Destination Hub Synced'].map(c => (
                   <div key={c} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {c}
                   </div>
                ))}
             </div>
          </div>
       </div>
       
       <button onClick={onNext} className="px-16 py-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-[32px] shadow-2xl shadow-blue-600/40 uppercase tracking-widest text-sm transition-all scale-105 active:scale-100">
          Initialize Build Tracking
       </button>
    </div>
  </div>
);

// --- FRAME 10: BUILD TRACKER ---
const StepBuildTracker: React.FC<{ onFinish: () => void }> = ({ onFinish }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 blur-3xl opacity-20 pointer-events-none" />
       <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="text-[10px] font-bold bg-blue-600/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20 uppercase tracking-widest">BUILD ACTIVE</span>
             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Target: Asgard Forge (Central)</span>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">NightOwl Payload Production Stream</h2>
          <p className="text-slate-400 font-medium">Tracking 120 structural part instances through multi-node network.</p>
       </div>
       <button onClick={onFinish} className="px-8 py-4 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded-[24px] transition-all uppercase tracking-widest text-xs shadow-xl active:scale-95">Return to Program Dashboard</button>
    </div>

    <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
       <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-3"><Layers className="w-5 h-5 text-blue-400" /> Multi-Part Provenance Matrix</h3>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> NOMINAL
                <div className="w-2 h-2 rounded-full bg-amber-500 ml-4" /> AT RISK
             </div>
             <div className="h-6 w-px bg-slate-800" />
             <Filter className="w-4 h-4 text-slate-500 cursor-pointer" />
          </div>
       </div>
       <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
             <thead>
                <tr className="bg-slate-800/30 border-b border-slate-800">
                   <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Serial / Lot ID</th>
                   <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Current Node</th>
                   <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase">Gate Sequence</th>
                   <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-center">Artifacts</th>
                   <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase text-right">ETA @ Forge</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-800">
                {[
                  { id: 'SN-2047-001', node: 'Apex (Austin TX)', gate: 'Machining Proof', art: 92, eta: 'Nov 18', status: 'NOMINAL' },
                  { id: 'SN-2047-002', node: 'Apex (Austin TX)', gate: 'Rough Milling', art: 45, eta: 'Nov 22', status: 'NOMINAL' },
                  { id: 'LOT-2047-A', node: 'Great Lakes Heavy', gate: 'Wait for Anodize', art: 12, eta: 'Dec 05', status: 'AT RISK' }
                ].map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-all cursor-pointer group">
                     <td className="px-8 py-8">
                        <span className="mono font-bold text-white text-sm tracking-tighter uppercase">{p.id}</span>
                     </td>
                     <td className="px-8 py-8">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-tight">{p.node}</p>
                        <p className={`text-[9px] font-bold mt-1 uppercase tracking-widest ${p.status === 'NOMINAL' ? 'text-emerald-500' : 'text-amber-500'}`}>{p.status}</p>
                     </td>
                     <td className="px-8 py-8">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                              <FlaskConical className="w-4 h-4 text-blue-500" />
                           </div>
                           <span className="text-xs font-bold text-slate-200 uppercase">{p.gate}</span>
                        </div>
                     </td>
                     <td className="px-8 py-8 text-center">
                        <div className="flex items-center justify-center gap-3">
                           <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${p.art}%` }} />
                           </div>
                           <span className="text-[10px] font-bold text-slate-400">{p.art}%</span>
                        </div>
                     </td>
                     <td className="px-8 py-8 text-right">
                        <span className="text-xs font-bold text-white italic">{p.eta}</span>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  </div>
);

export default RFQWorkflowWizard;
