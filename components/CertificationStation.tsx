import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle as XCircleIcon,
  Activity, ChevronRight, AlertTriangle,
  Info
} from 'lucide-react';
import { logAction } from '../services/auditService';
import HelpModal from './HelpModal';

interface CertStep {
  title: string;
  criteria: string;
  imageUrl: string;
  checks: string[];
}

interface CertificationStationProps {
  job?: any;
  onComplete: (details: any) => void;
  onFlagIssue: () => void;
}

const CertificationStation: React.FC<CertificationStationProps> = ({ job, onComplete, onFlagIssue }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [completedChecks, setCompletedChecks] = useState<Set<string>>(new Set());
  const [isFinishing, setIsFinishing] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const steps: CertStep[] = [
    { 
      title: 'Material MTR Verification', 
      criteria: 'Confirm material lot ID matches the ASGARD digital ledger exactly.',
      imageUrl: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=800',
      checks: ['QR Scan Hash confirmed', 'Heat lot ID matches MTR', 'ITAR Metadata locked']
    },
    { 
      title: 'Visual Surface Audit', 
      criteria: 'Zero visible pits, tool marks, or chatter on primary mating faces.',
      imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
      checks: ['Primary face audit complete', 'Zero chatter on Datum C', 'Coating thickness visual check']
    },
    { 
      title: 'CMM Program Review', 
      criteria: 'Dimensional variance within ±0.005" across all 32 critical datums.',
      imageUrl: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=800',
      checks: ['CMM Report 0992 verified', '±0.005" tolerance verified', 'Symmetry check passed']
    },
    { 
      title: 'Special Process Sign-off', 
      criteria: 'Anodize certification packet matches MIL-A-8625 Type II standard.',
      imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
      checks: ['MIL-A-8625 compliance confirmed', 'Bake cycle log attached', 'Seal test artifact uploaded']
    }
  ];

  const currentStep = steps[currentStepIdx];
  const allChecksDone = currentStep.checks.every(c => completedChecks.has(`${currentStepIdx}-${c}`));

  const toggleCheck = (check: string) => {
    const key = `${currentStepIdx}-${check}`;
    const next = new Set(completedChecks);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setCompletedChecks(next);
  };

  const handleResult = (pass: boolean) => {
    setResults({ ...results, [currentStepIdx]: pass });
  };

  const handleNext = async () => {
    const isLast = currentStepIdx === steps.length - 1;
    
    if (results[currentStepIdx] === false) {
      await logAction(
        'QC-AUTO',
        'NCR_CREATED',
        job?.wo || 'WO-8804',
        `Automatic NCR triggered by failed inspection step: ${steps[currentStepIdx].title}`
      );
      onFlagIssue();
      return;
    }

    if (isLast) {
      setIsFinishing(true);
      await logAction(
        'QC-USER-09',
        'CERTIFICATION_COMPLETED',
        job?.wo || 'WO-8804',
        `Job released to Next Node.`
      );
      setTimeout(() => onComplete({
        wo: job?.wo,
        part: job?.part,
        op: job?.op,
        station: 'Quality Node: LB-QC-09',
        nextOp: 'Final Packing & Logistics',
        nextStation: 'Shipping Station'
      }), 1000);
    } else {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const progress = ((currentStepIdx + 1) / steps.length) * 100;

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden animate-in fade-in duration-500">
      {/* Header Panel */}
      <div className="h-16 flex justify-between items-center bg-slate-900/50 border-b border-slate-800 px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
           <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <ShieldCheck className="w-5 h-5" />
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-widest italic">Quality Node: LB-QC-09</span>
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{job?.wo || 'WO-8804'}</span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tighter uppercase italic leading-none">{job?.op || 'System Release Inspection'}</h2>
           </div>
        </div>
        <div className="flex flex-col items-end gap-1">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Gate Readiness: {currentStepIdx + 1}/{steps.length}</p>
           <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
           </div>
        </div>
      </div>

      {/* Workspace Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Inspection Pane */}
        <div className="w-3/5 p-4 flex flex-col gap-4">
          <div className="flex-1 rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center relative">
            <img src={currentStep.imageUrl} className="w-full h-full object-cover opacity-90" alt={currentStep.title} />
            <div className="absolute top-4 left-4 px-4 py-1.5 bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg border border-white/10">Verification Zone</div>
          </div>
          <div className="h-20 flex gap-4">
             <button 
               disabled={!allChecksDone}
               onClick={() => handleResult(true)}
               className={`flex-1 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                 results[currentStepIdx] === true ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-700'
               } ${!allChecksDone ? 'opacity-20' : ''}`}
             >
                <CheckCircle2 className="w-4 h-4" /> Pass
             </button>
             <button 
               disabled={!allChecksDone}
               onClick={() => handleResult(false)}
               className={`flex-1 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                 results[currentStepIdx] === false ? 'bg-red-600 border-red-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-700'
               } ${!allChecksDone ? 'opacity-20' : ''}`}
             >
                <XCircleIcon className="w-4 h-4" /> Fail
             </button>
          </div>
        </div>

        {/* Requirements Pane */}
        <div className="w-2/5 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{currentStep.title}</h3>
             <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 border-dashed">
                <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"{currentStep.criteria}"</p>
             </div>
          </div>
          <div className="space-y-2">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Mandatory Controls</p>
             {currentStep.checks.map(check => (
               <button 
                 key={check}
                 onClick={() => toggleCheck(check)}
                 className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left ${
                   completedChecks.has(`${currentStepIdx}-${check}`) 
                     ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xl' 
                     : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                 }`}
               >
                 <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                   completedChecks.has(`${currentStepIdx}-${check}`) ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-950 border-slate-700'
                 }`}>
                   {completedChecks.has(`${currentStepIdx}-${check}`) && <CheckCircle2 className="w-4 h-4 text-white" />}
                 </div>
                 <span className={`text-[11px] font-bold uppercase italic tracking-tight leading-none ${completedChecks.has(`${currentStepIdx}-${check}`) ? 'text-emerald-400' : 'text-slate-500'}`}>{check}</span>
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="h-24 bg-slate-900/50 border-t border-slate-800 px-6 flex justify-between items-center shrink-0 z-10">
        <div className="flex gap-3">
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="h-14 px-6 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-slate-700 flex items-center gap-2"
          >
            <Info className="w-4 h-4" /> Help
          </button>
          <button 
            onClick={onFlagIssue}
            className="h-14 px-6 bg-red-600/10 text-red-400 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-red-500/20 flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Flag Issue
          </button>
        </div>
        <button 
          onClick={handleNext}
          disabled={results[currentStepIdx] === undefined || isFinishing}
          className={`h-14 px-12 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 ${
            results[currentStepIdx] !== undefined 
              ? 'bg-primary text-white shadow-primary/30' 
              : 'bg-slate-800 text-slate-600 opacity-50'
          }`}
        >
          {isFinishing ? (
            <Activity className="w-6 h-6 animate-spin" />
          ) : (
            <>
              {results[currentStepIdx] === false ? 'Record Failure' : 'Confirm & Proceed'}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        context={{
          wo: job?.wo || 'WO-8804',
          part: job?.part || '8802-105',
          station: 'Quality Node: LB-QC-09',
          op: currentStep.title
        }}
      />
    </div>
  );
};

const XCircleLocal = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);

export default CertificationStation;
